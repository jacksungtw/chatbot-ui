# TODO

## 每日派工

- [x] 導覽、嵌入派工介面、既有登入、固定端點代理及主管權限。
- [ ] 設定獨立派工服務與持久磁碟、備份、正式角色名單及伺服器金鑰。
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
