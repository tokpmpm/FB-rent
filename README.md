# FB Rental Scraper

Facebook 租屋貼文抓取與展示系統

## 功能特色

### 網頁介面 (Web)
- 🎨 現代化的 Next.js 14 介面
- 📊 即時租屋資料展示
- 🎚️ 進階篩選功能：
  - 租金範圍滑桿
  - 房型多選
  - 性別篩選
  - 寵物篩選
  - 地點搜尋
- 📅 按貼文日期排序
- 📱 響應式設計

### 資料抓取 (Scraper)
- 🤖 自動化 Facebook 租屋社團爬蟲
- 🧠 AI 智能解析（OpenRouter + Grok 4.1 Fast）
- 💾 Supabase 資料庫儲存
- ⏰ GitHub Actions 定時執行

## 技術棧

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase Client

### Backend
- Python 3.x
- Playwright (瀏覽器自動化)
- OpenRouter API (LLM)
- Supabase (資料庫)

## 快速開始

### 環境需求
- Node.js 18+
- Python 3.8+

### 安裝步驟

1. **克隆專案**
```bash
git clone <your-repo-url>
cd FB-rent
```

2. **設定 Web 環境**
```bash
cd web
npm install
cp .env.local.example .env.local
# 編輯 .env.local 填入 Supabase 憑證
```

3. **執行開發伺服器**
```bash
npm run dev
```

訪問 http://localhost:3000

### 環境變數

#### Web (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 資料庫結構

使用 Supabase，表結構請參考 `supabase_schema.sql`

## 授權

MIT License
