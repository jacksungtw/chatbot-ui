// app/api/chat/route.ts
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;
export const preferredRegion = "iad1"; // 可選

type ChatMessage = { role: "system"|"user"|"assistant"; content: string };

function trimMessages(messages: ChatMessage[], maxChars = 120000) {
  // 粗略限制字元，避免一次貼上超長 txt 造成 400/413
  let total = 0;
  const out: ChatMessage[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    total += (m.content?.length || 0);
    if (total <= maxChars) out.unshift(m);
    else break;
  }
  return out;
}

export async function POST(req: Request) {
  const timeoutMs = 25000;               // 保證 25s 內給前端結果
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);

  try {
    const body = await req.json();
    const {
      messages = [],
      model = "gpt-5",
      stream: wantStream,                // 前端可傳 true/false
      temperature,                       // 建議：未通過驗證先別亂改
    } = body || {};

    // 若組織尚未 Verify，請傳 stream=false（或在這裡強制）
    const stream = typeof wantStream === "boolean" ? wantStream : false;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
      // organization: process.env.OPENAI_ORG_ID,
      fetch: (input, init) => fetch(input as any, { ...init, signal: ac.signal }),
    });

    // 簡單的超長保護（也可用 tokens 估算）
    const safeMessages: ChatMessage[] = trimMessages(messages);

    if (!stream) {
      // 非串流：適合尚未 Verify 的帳號，或前端需要一次拿完整結果
      const completion = await Promise.race([
        openai.chat.completions.create({
          model,
          messages: safeMessages,
          // 若之前遇到 "only temperature=1"，就別傳或傳 1
          ...(typeof temperature === "number" ? { temperature } : {}),
          stream: false,
        }),
        (async () => {
          await new Promise((r) => setTimeout(r, timeoutMs));
          throw Object.assign(new Error("Upstream timeout"), { status: 504 });
        })(),
      ]);

      clearTimeout(timer);
      const text = completion.choices?.[0]?.message?.content ?? "";
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // 串流：組織已 Verify 時再開，能快速送出首包，避開 25s
    const response = await openai.chat.completions.create({
      model,
      messages: safeMessages,
      ...(typeof temperature === "number" ? { temperature } : {}),
      stream: true,
    });

    const encoder = new TextEncoder();
    const streamBody = new ReadableStream({
      start(controller) {
        (async () => {
          try {
            for await (const chunk of response) {
              const delta = chunk.choices?.[0]?.delta?.content ?? "";
              if (delta) {
                controller.enqueue(encoder.encode(delta));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          } finally {
            clearTimeout(timer);
          }
        })();
      },
      pull() {},
      cancel() { clearTimeout(timer); }
    });

    return new Response(streamBody, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",  // 前端可直接讀取
        "cache-control": "no-store",
      },
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
