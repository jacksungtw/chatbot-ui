# Status

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
