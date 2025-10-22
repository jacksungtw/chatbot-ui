// app/api/openai/assistants/route.ts
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;
export const preferredRegion = "iad1"; // 可選

export async function GET() {
  // 20s 逾時防護，避免上游卡住
  const timeoutMs = 20000;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "", // 建議使用 project 金鑰 sk-proj-...
      // organization: process.env.OPENAI_ORG_ID, // 可留空
      fetch: (input, init) => fetch(input as any, { ...init, signal: ac.signal }),
    });

    const assistants = await Promise.race([
      openai.beta.assistants.list({ limit: 100 }),
      (async () => {
        await new Promise((r) => setTimeout(r, timeoutMs));
        throw Object.assign(new Error("Upstream timeout"), { status: 504 });
      })(),
    ]);

    clearTimeout(timer);
    return new Response(JSON.stringify({ assistants: assistants.data ?? [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    clearTimeout(timer);
    const status =
      e?.status ||
      e?.response?.status ||
      (e?.name === "AbortError" ? 504 : 500);
    const message =
      e?.error?.message ||
      e?.response?.data?.error?.message ||
      e?.message ||
      "An unexpected error occurred";
    return new Response(JSON.stringify({ message }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }
}
