import { LLM } from "@/types"

const OPENAI_PLATORM_LINK = "https://platform.openai.com/docs/overview"

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
  modelName: "無雲 RAG · 法律 NDA",
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

export const OPENAI_LLM_LIST: LLM[] = [
  WuyunRagYishan,
  WuyunRagEnvLaw,
  WuyunRagMachineContract,
  WuyunRagCarContract,
  WuyunRagZhenling,
  WuyunRagMachineManual,
  WuyunRagLegalNda,
  WuyunRagLegacy,
  GPT4o,
  GPT4Turbo,
  GPT4Vision,
  GPT4,
  GPT3_5Turbo
]
