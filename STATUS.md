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
- Deployment and production streaming validation: pending. No production success is claimed yet.
- Credentials stay in the existing application's secret storage and are excluded from this repository and reports.
