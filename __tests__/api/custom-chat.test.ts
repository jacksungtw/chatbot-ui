/** @jest-environment node */

import { POST } from "@/app/api/chat/custom/route"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

jest.mock("@supabase/supabase-js", () => ({ createClient: jest.fn() }))
jest.mock("openai", () => ({ __esModule: true, default: jest.fn() }))
jest.mock("ai", () => ({
  OpenAIStream: jest.fn(
    () =>
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("MODEL_OK"))
          controller.close()
        }
      })
  ),
  StreamingTextResponse: jest.fn(stream => new Response(stream))
}))

const createCompletion = jest.fn()
const single = jest.fn()
const eq = jest.fn(() => ({ single }))

beforeEach(() => {
  jest.clearAllMocks()
  single.mockResolvedValue({
    data: { api_key: "test-only-key", base_url: "https://api.openai.com/v1" },
    error: null
  })
  jest.mocked(createClient).mockReturnValue({
    from: jest.fn(() => ({ select: jest.fn(() => ({ eq })) }))
  } as unknown as ReturnType<typeof createClient>)
  jest
    .mocked(OpenAI)
    .mockImplementation(
      () =>
        ({
          chat: { completions: { create: createCompletion } }
        }) as unknown as OpenAI
    )
  createCompletion.mockResolvedValue({})
})

async function send(model: string) {
  return POST(
    new Request("https://chatbot.example/api/chat/custom", {
      method: "POST",
      body: JSON.stringify({
        chatSettings: { model, temperature: 0.4 },
        messages: [{ role: "user", content: "Reply MODEL_OK" }],
        customModelId: "saved-model-record"
      })
    })
  )
}

test.each([
  "gpt-6-astra",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
  "gpt-5.5"
])("streams %s without unsupported sampling parameters", async model => {
  const response = await send(model)

  expect(response.status).toBe(200)
  expect(await response.text()).toBe("MODEL_OK")
  expect(eq).toHaveBeenCalledWith("id", "saved-model-record")
  expect(createCompletion).toHaveBeenCalledWith({
    model,
    messages: [{ role: "user", content: "Reply MODEL_OK" }],
    stream: true
  })
})

test.each(["rag-local", "openclaw-broker", "gpt-4-turbo-preview"])(
  "preserves temperature for existing %s connections",
  async model => {
    await send(model)
    expect(createCompletion).toHaveBeenCalledWith(
      expect.objectContaining({ model, temperature: 0.4, stream: true })
    )
  }
)

test("preserves upstream error status for failed model calls", async () => {
  createCompletion.mockRejectedValueOnce({
    status: 429,
    message: "Rate limited"
  })
  const response = await send("gpt-6-astra")
  expect(response.status).toBe(429)
  expect(await response.json()).toEqual({ message: "Rate limited" })
})
