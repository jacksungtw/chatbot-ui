# TODO

## 每日派工

- [x] 修正反向代理來源比對造成的 POST 403，保留精確 Origin 驗證並新增測試。
- [ ] 線上瀏覽器確認此次 403 修正後能產生草稿。

- [x] 導覽、嵌入派工介面、既有登入、固定端點代理及主管權限。
- [x] 部署独立派工服務與持久磁碟、設定伺服器金鑰並驗證私網連線。
- [x] 師父指定主管登入 Email，核對唯一已驗證帳號並加入主管 UUID 名單；其他帳號維持拒絕。
- [ ] 異地／自動備份與保留政策；部署分支整合回 main，防止日後自動部署覆蓋。
- [ ] 分開審查既有 npm audit 依賴漏洞，不在派工整合中直接做破壞性升級。
- [ ] 部署並驗證手機／桌面真實選檔、解鎖、草稿、主管確認與下載。
- [ ] 同仁每日流程平行驗收；蝦皮自動下載與 LINE 傳送尚未實作。

## 既有模型上架

- [x] Confirm the deployed source revision and target workspace.
- [x] Confirm the existing key can access all five requested model IDs.
- [x] Fix GPT-5/6 sampling parameter compatibility.
- [x] Run regression tests, type checks, and production build; document the unrelated existing OpenAPI test failure.
- [x] Register the missing private model records in the target workspace.
- [x] Deploy the compatibility fix.
- [x] Verify a real production streaming reply from each of the five models.
- [x] Verify all five appear in the browser model selector.
- [x] Verify an actual Astra browser reply and its persisted user/assistant messages.

Unrelated existing backlog: the OpenAPI conversion stocksTicker test still fails.
