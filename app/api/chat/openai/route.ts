import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

// 改用 nodejs runtime：edge runtime 在 Railway 環境讀不到 process.env.OPENAI_BASE_URL，
// 導致 OpenAI SDK 用預設 api.openai.com、自定 model id（wuyun-rag-*）回 404。
export const runtime: ServerRuntime = "nodejs"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id,
      // 顯式指向 wuyun-bridge，讓 chat completion 也走 bridge（自定 model id 才能 routed）
      baseURL: process.env.OPENAI_BASE_URL || undefined,
      // 帶上使用者身份給 bridge 做權限檢查
      // 優先用 display_name（人類可讀，如 jacksung）；fallback username（UUID）
      defaultHeaders: {
        "X-User-Name":
          (profile as any).display_name ||
          (profile as any).username ||
          "",
        "X-User-Email": (profile as any).user_email || ""
      }
    })

    const modelId = String(chatSettings.model).toLowerCase()
    const isReasoning =
      modelId.startsWith("gpt-5") ||
      modelId.startsWith("o1") ||
      modelId.startsWith("o3") ||
      modelId.startsWith("o4")

    // 組 request payload — reasoning models 不接受 temperature 等取樣參數
    const reqParams: any = {
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages as ChatCompletionCreateParamsBase["messages"],
      stream: true
    }
    if (!isReasoning) {
      reqParams.temperature = chatSettings.temperature
      reqParams.max_tokens =
        chatSettings.model === "gpt-4-vision-preview" ||
        chatSettings.model === "gpt-4o"
          ? 4096
          : null
    }

    const response = await openai.chat.completions.create(reqParams)

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "OpenAI API Key not found. Please set it in your profile settings."
    } else if (errorMessage.toLowerCase().includes("incorrect api key")) {
      errorMessage =
        "OpenAI API Key is incorrect. Please fix it in your profile settings."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
