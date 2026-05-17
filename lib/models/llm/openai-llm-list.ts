import { LLM } from "@/types"

const OPENAI_PLATORM_LINK = "https://platform.openai.com/docs/overview"

// GPT-5.5（OpenAI 官方，2026 新版）
const GPT5_5: LLM = {
  modelId: "gpt-5.5",
  modelName: "GPT-5.5",
  provider: "openai",
  hostedId: "gpt-5.5",
  platformLink: "https://platform.openai.com/docs/overview",
  imageInput: true
}

// DeepSeek V4 / V4 PRO（透過 bridge 轉發到 api.deepseek.com）
const DeepSeekV4: LLM = {
  modelId: "deepseek-v4",
  modelName: "DeepSeek V4",
  provider: "openai", // chatbot-ui 視為 openai 兼容，走 OPENAI_BASE_URL=bridge
  hostedId: "deepseek-v4",
  platformLink: "https://www.deepseek.com/",
  imageInput: false
}

const DeepSeekV4Pro: LLM = {
  modelId: "deepseek-v4-pro",
  modelName: "DeepSeek V4 PRO",
  provider: "openai",
  hostedId: "deepseek-v4-pro",
  platformLink: "https://www.deepseek.com/",
  imageInput: false
}

// OpenAI Models (UPDATED 1/25/24) -----------------------------
const GPT4o: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

// GPT-4 Turbo (UPDATED 1/25/24)
const GPT4Turbo: LLM = {
  modelId: "gpt-4-turbo-preview",
  modelName: "GPT-4 Turbo",
  provider: "openai",
  hostedId: "gpt-4-turbo-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10,
    outputCost: 30
  }
}

// GPT-4 Vision (UPDATED 12/18/23)
const GPT4Vision: LLM = {
  modelId: "gpt-4-vision-preview",
  modelName: "GPT-4 Vision",
  provider: "openai",
  hostedId: "gpt-4-vision-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10
  }
}

// GPT-4 (UPDATED 1/29/24)
const GPT4: LLM = {
  modelId: "gpt-4",
  modelName: "GPT-4",
  provider: "openai",
  hostedId: "gpt-4",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 30,
    outputCost: 60
  }
}

// GPT-3.5 Turbo (UPDATED 1/25/24)
const GPT3_5Turbo: LLM = {
  modelId: "gpt-3.5-turbo",
  modelName: "GPT-3.5 Turbo",
  provider: "openai",
  hostedId: "gpt-3.5-turbo",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: false,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.5,
    outputCost: 1.5
  }
}

// ============================================================================
// Wuyun Bridge RAG models — routed through OPENAI_BASE_URL (wuyun-bridge)
// Each id maps to one AnythingLLM workspace in the bridge's MODEL_REGISTRY.
// ============================================================================

const WUYUN_RAG_PLATFORM = "https://wuyun-bridge-production.up.railway.app"

const WuyunRagYishan: LLM = {
  modelId: "wuyun-rag-yishan",
  modelName: "無雲 RAG · 益山",
  provider: "openai",
  hostedId: "wuyun-rag-yishan",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagEnvLaw: LLM = {
  modelId: "wuyun-rag-env-law",
  modelName: "無雲 RAG · 環保法規",
  provider: "openai",
  hostedId: "wuyun-rag-env-law",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagMachineContract: LLM = {
  modelId: "wuyun-rag-machine-contract",
  modelName: "無雲 RAG · 機器合約書",
  provider: "openai",
  hostedId: "wuyun-rag-machine-contract",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagCarContract: LLM = {
  modelId: "wuyun-rag-car-contract",
  modelName: "無雲 RAG · 車廠合約書",
  provider: "openai",
  hostedId: "wuyun-rag-car-contract",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagZhenling: LLM = {
  modelId: "wuyun-rag-zhenling",
  modelName: "無雲 RAG · 真伶",
  provider: "openai",
  hostedId: "wuyun-rag-zhenling",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagMachineManual: LLM = {
  modelId: "wuyun-rag-machine-manual",
  modelName: "無雲 RAG · 機器說明書",
  provider: "openai",
  hostedId: "wuyun-rag-machine-manual",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagLegalNda: LLM = {
  modelId: "wuyun-rag-legal-nda",
  modelName: "無雲 · 法律合約風險評估",
  provider: "openai",
  hostedId: "wuyun-rag-legal-nda",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

const WuyunRagLegacy: LLM = {
  modelId: "wuyun-rag",
  modelName: "無雲 RAG · 預設",
  provider: "openai",
  hostedId: "wuyun-rag",
  platformLink: WUYUN_RAG_PLATFORM,
  imageInput: false
}

// 全面改用 DeepSeek V4（價格約 GPT-4o 的 1/20）；
// GPT-4o / GPT-5.5 暫時移除避免誤點燒 OpenAI 額度（embedding 仍走 OpenAI key）。
export const OPENAI_LLM_LIST: LLM[] = [
  WuyunRagYishan,
  WuyunRagEnvLaw,
  WuyunRagMachineContract,
  WuyunRagCarContract,
  WuyunRagZhenling,
  WuyunRagMachineManual,
  WuyunRagLegalNda,
  WuyunRagLegacy,
  DeepSeekV4,
  DeepSeekV4Pro
]
