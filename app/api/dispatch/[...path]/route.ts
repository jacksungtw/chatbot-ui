import { createClient } from "@/lib/supabase/server"
import {
  dispatchOriginAllowed,
  dispatchPath,
  dispatchRole
} from "@/lib/server/dispatch-policy"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
}
const error = (status: number, detail: string) =>
  Response.json({ detail }, { status, headers })

async function handle(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const path = dispatchPath(context.params.path, request.method)
  if (!path) return error(404, "Unknown dispatch operation")
  const supabase = createClient(cookies())
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (authError || !user) return error(401, "請先登入 Chatbot UI")
  const role = dispatchRole(user.id)
  if (!role) return error(403, "帳號尚未獲派工權限，請聯絡管理員")
  if (
    request.method === "POST" &&
    !dispatchOriginAllowed(
      request.headers.get("origin"),
      request.nextUrl.origin
    )
  ) {
    return error(403, "Cross-origin request denied")
  }
  if (path.endsWith("/confirm") && role !== "supervisor")
    return error(403, "Supervisor required")
  if (path === "session/me")
    return Response.json(
      { username: user.email || user.id, role, csrf: "same-origin" },
      { headers }
    )

  const base = process.env.TOSHIP_SERVICE_URL
  const key =
    role === "supervisor"
      ? process.env.TOSHIP_SUPERVISOR_KEY
      : process.env.TOSHIP_OPERATOR_KEY
  if (!base || !key) return error(503, "派工服務尚未設定，請勿重複上傳")
  let url: URL
  try {
    url = new URL(base)
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error()
    if (
      url.protocol === "http:" &&
      !["127.0.0.1", "localhost"].includes(url.hostname) &&
      !url.hostname.endsWith(".railway.internal")
    )
      throw new Error()
    url.pathname = `/${path}`
    if (path === "toship/assign-file")
      url.searchParams.set(
        "gen_date",
        request.nextUrl.searchParams.get("gen_date") || ""
      )
  } catch {
    return error(503, "Invalid dispatch service configuration")
  }

  let body: Uint8Array | undefined
  if (request.method === "POST") {
    const maximum = ["toship/assign", "toship/assign-file"].includes(path)
      ? 11 * 1024 * 1024
      : 16384
    const reader = request.body?.getReader()
    if (!reader) return error(422, "Missing request body")
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      length += chunk.value.length
      if (length > maximum) {
        await reader.cancel()
        return error(413, "Upload too large")
      }
      chunks.push(chunk.value)
    }
    body = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) {
      body.set(chunk, offset)
      offset += chunk.length
    }
  }
  try {
    const upstream = await fetch(url, {
      method: request.method,
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(120000),
      headers: {
        Authorization: `Bearer ${key}`,
        "X-Toship-Actor": user.id,
        "Content-Type":
          request.headers.get("content-type") || "application/json",
        ...(path === "toship/assign-file" &&
        request.headers.has("x-workbook-password")
          ? {
              "X-Workbook-Password": request.headers.get("x-workbook-password")!
            }
          : {})
      }
    })
    const responseHeaders = new Headers(headers)
    for (const name of ["content-type", "content-disposition"]) {
      const value = upstream.headers.get(name)
      if (value) responseHeaders.set(name, value)
    }
    if (path === "ui" && upstream.ok) {
      const html = (await upstream.text())
        .replace(
          '<html lang="zh-Hant">',
          '<html lang="zh-Hant" data-api-prefix="/api/dispatch" data-integrated="true">'
        )
        .replace('src="/ui/app.js"', 'src="/api/dispatch/ui/app.js"')
      responseHeaders.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; base-uri 'none'"
      )
      return new Response(html, { headers: responseHeaders })
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders
    })
  } catch {
    return error(502, "派工服務暫時無法連線，請稍後再試")
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  const response = await handle(request, context)
  if (context.params.path.join("/") === "ui" && !response.ok) {
    const text =
      response.status === 401
        ? "請先登入 Chatbot UI。"
        : response.status === 403
          ? "帳號尚未獲派工權限，請聯絡管理員。"
          : "派工服務尚未連線或尚未完成設定，請勿重複上傳。"
    return new Response(
      `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>每日派工</title><body><h2>每日派工尚未可用</h2><p>${text}</p></body></html>`,
      {
        status: response.status,
        headers: { ...headers, "Content-Type": "text/html; charset=utf-8" }
      }
    )
  }
  return response
}
export const POST = handle
