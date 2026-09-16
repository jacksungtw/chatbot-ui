# Status

## 2026-09-16 主管授權

- 師父已指定登入 Email；已在 Supabase 精確核對唯一且已驗證的帳號，將對應 UUID 加入主管名單，未變更密碼或一般同仁權限。
- 部署 SUCCESS；在執行中容器驗證指定 UUID 已存在、主管名單共 1 人。這是設定生效驗證，不是登入後瀏覽器驗收。
- 以既有部署來源重新建置 6065db39-79b7-4333-a3c6-87a260a49bf0 套用設定，不從 main 拉回舊程式。
- 實際登入、選檔與主管確認仍需驗收；Invalid login credentials 是登入問題，不等於派工授權失敗。

## 每日派工整合：已部署，主管授權與業務驗收待完成

- 2026-09-16 部署 c0674f1a-37e2-4d3c-af7c-3297b8b558f0 SUCCESS，來源 f69b768。線上 sw.js 已含派工 NetworkOnly 規則。

- 新增工作區「每日派工」頁面與側欄入口，使用既有 Supabase 登入及伺服器端角色名單。
- 同源代理僅放行固定派工端點；服務金鑰不送到瀏覽器，主管确认需主管權限與同源請求。
- 支援派工服務的原始 Excel 上傳與解鎖密碼轉送，確認紀錄傳遞已驗證的使用者 ID。
- 正式私網 URL 與兩把伺服器金鑰已設定；Chatbot UI 容器到派工後端呼叫 200，取得 v176 測試草稿 142 支且 confirmed=false。
- 三個公開派工 API 匿名請求均為 401/no-store；瀏覽器派工頁導回 /zh/login。
- 師父尚未指定主管登入 Email，兩組角色名單均未設定，因此所有使用者預設無派工權限。瀏覽器上傳端到端驗收未完成。
- 派工代理與快取共 12 項測試、TypeScript 檢查通過；Railway production build 成功。後端另有 53 項測試通過。
- CLI 初次選錯來源目錄導致建置失敗但未取代舊服務；後以 `railway up . --path-as-root` 完成部署。
- 目前是 CLI 部署，GitHub 自動部署仍指向原 main；下次從 main 部署前必須整合 codex/dispatch-integration，避免覆蓋此功能。
- 建置的 npm audit 顯示既有依賴 67 項警示（含 4 critical），尚未完成可利用性審查，未盲目 audit fix 升級。
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
