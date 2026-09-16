/** @jest-environment node */
import { GET, POST } from "@/app/api/dispatch/[...path]/route"
import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"
jest.mock("@/lib/supabase/server", () => ({ createClient: jest.fn() }))
jest.mock("next/headers", () => ({ cookies: jest.fn() }))
const auth = jest.fn()
const upstream = jest.fn()
beforeEach(() => {
  delete process.env.TOSHIP_PUBLIC_ORIGIN
  jest.clearAllMocks()
  jest.mocked(createClient).mockReturnValue({ auth: { getUser: auth } } as any)
  auth.mockResolvedValue({
    data: { user: { id: "worker", email: "test@example.invalid" } },
    error: null
  })
  process.env.TOSHIP_OPERATOR_USER_IDS = "worker"
  process.env.TOSHIP_SUPERVISOR_USER_IDS = "manager"
  process.env.TOSHIP_SERVICE_URL = "https://dispatch.example"
  process.env.TOSHIP_OPERATOR_KEY = "server-only-operator"
  process.env.TOSHIP_SUPERVISOR_KEY = "server-only-supervisor"
  global.fetch = upstream
  upstream.mockResolvedValue(
    new Response('{"status":"draft"}', {
      headers: { "Content-Type": "application/json" }
    })
  )
})

test("trusted public origin works behind an internal HTTP proxy", async () => {
  process.env.TOSHIP_PUBLIC_ORIGIN = "https://chat.example"
  const req = new NextRequest(
    "http://localhost:8080/api/dispatch/toship/assign-file?gen_date=2026-09-16",
    {
      method: "POST",
      headers: {
        origin: "https://chat.example",
        "Content-Type": "application/octet-stream"
      },
      body: "synthetic"
    }
  )
  const result = await POST(req, {
    params: { path: ["toship", "assign-file"] }
  })
  expect(result.status).toBe(200)
  expect(upstream).toHaveBeenCalledTimes(1)
})

test("forwarded host cannot override configured origin", async () => {
  process.env.TOSHIP_PUBLIC_ORIGIN = "https://chat.example"
  const req = new NextRequest(
    "http://localhost:8080/api/dispatch/toship/assign-file",
    {
      method: "POST",
      headers: {
        origin: "https://evil.example",
        "x-forwarded-host": "evil.example",
        "x-forwarded-proto": "https"
      },
      body: "synthetic"
    }
  )
  expect(
    (await POST(req, { params: { path: ["toship", "assign-file"] } })).status
  ).toBe(403)
  expect(upstream).not.toHaveBeenCalled()
})
function request(
  path: string,
  method = "GET",
  origin = "https://chat.example"
) {
  const req = new NextRequest(`https://chat.example/api/dispatch/${path}`, {
    method,
    headers: { origin, "Content-Type": "application/octet-stream" },
    ...(method === "POST" ? { body: "synthetic" } : {})
  })
  return (method === "POST" ? POST : GET)(req, {
    params: { path: path.split("/") }
  })
}
test("missing session denied", async () => {
  auth.mockResolvedValue({ data: { user: null }, error: null })
  expect((await request("session/me")).status).toBe(401)
  expect(upstream).not.toHaveBeenCalled()
})
test("user must be explicitly authorized", async () => {
  delete process.env.TOSHIP_OPERATOR_USER_IDS
  expect((await request("session/me")).status).toBe(403)
})
test("current login reused without returning keys", async () => {
  const res = await request("session/me")
  expect(await res.json()).toEqual({
    username: "test@example.invalid",
    role: "operator",
    csrf: "same-origin"
  })
})
test("operator cannot confirm", async () => {
  expect(
    (await request(`toship/assign/${"a".repeat(32)}/confirm`, "POST")).status
  ).toBe(403)
  expect(upstream).not.toHaveBeenCalled()
})
test("cross origin mutation denied", async () => {
  expect(
    (await request("toship/assign", "POST", "https://evil.example")).status
  ).toBe(403)
})
test("only fixed routes can be proxied", async () => {
  expect((await request("session/login", "POST")).status).toBe(404)
  expect(upstream).not.toHaveBeenCalled()
})
test("upload goes through server credential", async () => {
  const res = await request("toship/assign", "POST")
  expect(res.status).toBe(200)
  expect(upstream.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer server-only-operator"
  )
  expect(await res.text()).not.toContain("server-only")
})
test("unconfigured backend fails closed", async () => {
  delete process.env.TOSHIP_SERVICE_URL
  expect((await request("ui")).status).toBe(503)
})

test("embedded UI uses authenticated proxy paths", async () => {
  upstream.mockResolvedValue(
    new Response(
      '<html lang="zh-Hant"><script src="/ui/app.js"></script></html>'
    )
  )
  const response = await request("ui")
  const html = await response.text()
  expect(html).toContain('data-api-prefix="/api/dispatch"')
  expect(html).toContain('src="/api/dispatch/ui/app.js"')
  expect(response.headers.get("Content-Security-Policy")).toContain(
    "frame-ancestors 'self'"
  )
})

test("supervisor confirmation forwards verified identity", async () => {
  auth.mockResolvedValue({ data: { user: { id: "manager" } }, error: null })
  expect(
    (await request(`toship/assign/${"a".repeat(32)}/confirm`, "POST")).status
  ).toBe(200)
  expect(upstream.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer server-only-supervisor"
  )
  expect(upstream.mock.calls[0][1].headers["X-Toship-Actor"]).toBe("manager")
})

test("public plaintext backend is rejected before forwarding keys", async () => {
  process.env.TOSHIP_SERVICE_URL = "http://dispatch.example"
  expect((await request("ui")).status).toBe(503)
  expect(upstream).not.toHaveBeenCalled()
})
