# Status

## 每日派工整合：未部署

- 2026-09-16 部署作業進行中；新增 PWA NetworkOnly 規則，派工 API 不得落入離線快取。

- 新增工作區「每日派工」頁面與側欄入口，使用既有 Supabase 登入及伺服器端角色名單。
- 同源代理僅放行固定派工端點；服務金鑰不送到瀏覽器，主管确认需主管權限與同源請求。
- 支援派工服務的原始 Excel 上傳與解鎖密碼轉送，確認紀錄傳遞已驗證的使用者 ID。
- 正式服務 URL、金鑰及人員授權仍未設定；尚未部署，瀏覽器上傳端到端驗收未完成。
- 派工代理 11 項測試及 TypeScript 檢查通過；後端另有 53 項測試通過。
- 部署與驗收步驟見 `docs/dispatch-integration.md`。下方模型上架紀錄不代表派工已上線。

## OpenAI model rollout - 2026-09-15

- Target: existing production Chatbot UI, Home workspace.
- Existing official OpenAI credential successfully authenticated. All five requested model IDs are present in its live model catalog.
- Existing GPT-5.6 Sol and GPT-5.5 records will be retained; add Astra, Terra, and Luna without duplicates.
- Custom chat requests omit unsupported temperature for GPT-5/6; other custom providers retain their existing sampling setting.
- Registration complete: added three private models and retained the existing two records and credentials.
- Reproduced the original production failure: Sol returned HTTP 400 for temperature 0.4.
- All nine custom-chat regression tests pass. Production build (including lint and TypeScript validation) passes.
- The root TypeScript/Jest projects now exclude the independently managed Playwright project, which has its own package.json.
- Full Jest run: 11/12 tests pass; the unchanged OpenAPI conversion test for stocksTicker fails. This unrelated existing failure is not hidden or changed.
- Production deployment succeeded: `1f28cdef-39b8-4999-815a-37967f3ab536`, source `04a65606f14229b2ad23eab247326354cbe0b3db`.
- All five production custom-chat calls returned HTTP 200 and MODEL_OK with stream=true at 2026-09-15T01:28:06Z. See `verification/production-models.json`.
- All five models are visibly selectable in the authenticated browser.
- Astra browser E2E passed: submitted a Chinese 2+3 question and received the correct answer. Both messages are persisted in chat `a48b4c2d-cc82-4962-bc0f-7e98b530ece1`.
- Rollout complete. The existing RAG/broker records and global bridge configuration were preserved.
- Final acceptance evidence is committed separately on the rollout branch so recording the result does not trigger another production build.
- Credentials stay in the existing application's secret storage and are excluded from this repository and reports.
