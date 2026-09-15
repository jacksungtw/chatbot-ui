import { readFile, mkdir, writeFile } from "node:fs/promises"

const handoff = JSON.parse(
  await readFile(new URL("../handoff.json", import.meta.url), "utf8")
)
const endpoint =
  "https://chatbot-ui-production-b5c7.up.railway.app/api/chat/custom"
const results = []

for (const model of handoff.models) {
  const started = Date.now()
  const result = { model, passed: false }
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customModelId: handoff.model_records[model],
        chatSettings: { model, temperature: 0.4 },
        messages: [{ role: "user", content: "Reply only with MODEL_OK." }]
      }),
      signal: AbortSignal.timeout(120000)
    })
    result.status = response.status
    result.content_type = response.headers.get("content-type")
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let text = ""
    let chunks = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks++
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
    result.chunks = chunks
    result.passed = response.ok && text.includes("MODEL_OK")
    result.response = text.replace(/sk-[A-Za-z0-9_-]+/g, "[hidden]").slice(0, 300)
  } catch (error) {
    result.error = error.name
  }
  result.duration_ms = Date.now() - started
  results.push(result)
  console.log(JSON.stringify(result))
}

const directory = new URL("../verification/", import.meta.url)
await mkdir(directory, { recursive: true })
await writeFile(
  new URL("production-models.json", directory),
  JSON.stringify({ tested_at: new Date().toISOString(), endpoint, results }, null, 2)
)
if (results.some(result => !result.passed)) process.exitCode = 1
