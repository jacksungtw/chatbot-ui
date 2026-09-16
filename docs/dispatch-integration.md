# 每日派工整合交接

## 現況

2026-09-16 更新：正式部署 c0674f1a-37e2-4d3c-af7c-3297b8b558f0 成功，私網呼叫 200；匿名 API 401，瀏覽器導回登入。主管 Email 尚未指定，兩個角色名單保持空白。PWA 已對派工端點設 NetworkOnly，線上 sw.js 已核對。這仍不是業務驗收完成。

已寫好 Chatbot UI 導覽、工作區 `/dispatch` 頁面和 `/api/dispatch/*` 同源代理。
瀏覽器檔案選取測試工具曾逾時，不能以單元測試宣稱上傳按鈕已驗收。
原有模型與 RAG 設定不變。後端是 shopee-reconcile 的 codex/toship-phase0 分支。

## 設定與邊界

Chatbot UI 伺服器需要以下環境變數，全部不得加 NEXT_PUBLIC 前綴：

- `TOSHIP_SERVICE_URL`：獨立派工服務根網址。公開網址必須 HTTPS；HTTP 僅允許 localhost 或 Railway 私網。
- `TOSHIP_OPERATOR_KEY`、`TOSHIP_SUPERVISOR_KEY`：與派工後端相同、各至少 32 字元且不同的金鑰。
- `TOSHIP_OPERATOR_USER_IDS`、`TOSHIP_SUPERVISOR_USER_IDS`：經主管核准的 Supabase 使用者 UUID，以逗號分隔。未列入者一律拒絕。

派工後端依自己的 docs/toship_api.md 啟動獨立 toship.api 服務，使用持久磁碟存放 TOSHIP_STORAGE_DIR；不要掛到舊 api_server.py。
正式歷史資料需從已交付檔受控匯入，不能拿展示資料庫當正式資料。備份、保留期限及清理仍待建置。
同一公司共用工作集合，不是各工程師或各工作區資料隔離；不可把入口開放給外部公司。

代理驗證 Supabase 使用者後選擇角色金鑰，只允許既定端點；POST 檢查 Origin。
嵌入頁沿用現有登入，不要求第二次登入或輸入服務金鑰。
Excel 解鎖密碼僅隨當次請求轉送，不寫入工作紀錄；部署的代理與監控也不得記錄此標頭。
主管確認才寫回歷史，不會自動發送 LINE。OTP 收取、蝦皮下載自動化不在本次功能內。

## 正式驗收

1. 部署後先確認未登入、未授權、一般同仁確認請求均被拒絕。
2. 以核准帳號開啟工作區「每日派工」，不另輸入 API 金鑰。
3. 手機及桌面實際選取測試 Excel，輸入派工日期，確認產生的是新草稿而非舊預覽。
4. 測試加密檔缺密碼、錯密碼、正確密碼；檢查介面顯示合理且密碼不進日誌。
5. 核對原始列數、數量、未分配及六項驗證；主管確認後核對 confirmed_by 為登入使用者 ID。
6. 實際下載核對 Excel，重複確認不可重複寫歷史；未通過者不得交付。

Railway 反向代理下仍須驗證 Origin 與請求 URL 相符，以及上傳容量／請求逾時限制。
只看到頁面或健康檢查成功，不算此流程驗收完成。

目前 CLI 手動部署，須用 `railway up . --path-as-root --service chatbot-ui --environment production` 指定根目錄。原 GitHub 自動部署仍是 main；下次 main 部署前須合併此分支，否則可能退回沒有派工功能的版本。
