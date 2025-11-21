# OpenRouter LLM 設定指南

## 如何取得 API Key

1. 前往 https://openrouter.ai/
2. 點擊右上角 **Sign In** 並使用 Google 或 GitHub 帳號登入
3. 登入後，點擊右上角頭像 → **Keys**
4. 點擊 **Create Key**，輸入名稱（例如：FB-Rent-Scraper）
5. 複製產生的 API Key（格式為 `sk-or-v1-...`）

## 設定環境變數

在 `scraper/.env` 檔案中新增：

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

## 測試 LLM 解析

執行以下指令重新解析所有資料：

```bash
cd scraper
../.venv/bin/python fix_data.py
```

你會看到類似輸出：
```
✓ LLM parsed: Amber Hyun - 40000 - 整層住家(2房或3房)
✓ LLM parsed: Tsai Wen Wen - 18000 - 整層住家 一房一廳
...
```

## 使用的免費模型

- **google/gemini-2.0-flash-exp:free**
  - 完全免費
  - 速度快
  - 中文支援優秀
  - 每分鐘最多 10 次請求

## 費用說明

OpenRouter 提供多個免費模型，包括：
- Google Gemini Flash (我們使用的)
- Meta Llama 3.1
- Mistral 7B

完全不需要信用卡！

## 優勢

相比 regex 方式，LLM 解析有以下優點：
- ✅ 更準確理解自然語言
- ✅ 自動處理各種格式（【】、[]、()等）
- ✅ 智能轉換單位（萬→實際數字）
- ✅ 理解複雜描述（例如"1男1女"自動計算為2人）
- ✅ 容錯能力強
