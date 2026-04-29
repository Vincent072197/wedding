@AGENTS.md

---

# Wedding Website — Project Blueprint

## Collaboration Rules

- **All interaction is in English.** Even if the user writes in Chinese, respond in English.
- **English correction first.** If the user's English contains a grammar mistake, correct it before answering — show: Error Breakdown, Corrected Version, Native Speaker Version.
- **Mentor mode.** Only show code in the chat. Never auto-apply code to files. Let the user type it themselves to build muscle memory.

> 這份文件是整個 app 的技術規劃藍圖，作為開發過程的紀錄與指引。
> 日期：2026-04-24｜婚禮日期：2026-10-20

---

## 專案背景

一個企業級婚禮網站，包含公開頁面、RSVP 系統、留言板，以及一套完整的後台管理系統，
讓主角（新人）可以自由佈置、管理整個網站內容，並可正式部署上線。

---

## Tech Stack

| 層級           | 技術                                            |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling        | Tailwind CSS 4 + Framer Motion                  |
| Database       | PostgreSQL (本地 port 5433, 雲端 Supabase)      |
| DB Client      | `pg` (node-postgres)                            |
| Auth           | JWT (jose library) + bcryptjs                   |
| Validation     | Zod                                             |
| Image Storage  | Supabase Storage (or Vercel Blob)               |
| Deployment     | Vercel (frontend) + Supabase (DB + Storage)     |
| Email (future) | Resend                                          |

---

## 資料庫 Schema（完整版）

### `admins` — 後台管理員帳號

```sql
CREATE TABLE admins (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name        VARCHAR(100),
  role        VARCHAR(20) NOT NULL DEFAULT 'admin', -- 'super_admin' | 'admin'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `site_config` — 網站所有可配置內容（Key-Value Store）

```sql
CREATE TABLE site_config (
  id          SERIAL PRIMARY KEY,
  section     VARCHAR(50)  NOT NULL, -- 'home' | 'gallery' | 'menu' | 'location' | 'theme'
  key         VARCHAR(100) NOT NULL,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section, key)
);
```

### `gallery_photos` — 相片（由 admin 上傳）

```sql
CREATE TABLE gallery_photos (
  id            SERIAL PRIMARY KEY,
  url           VARCHAR(1000) NOT NULL,
  caption       TEXT,
  alt_text      VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_by   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `guestbook_posts` — 賓客留言

```sql
CREATE TABLE guestbook_posts (
  id          SERIAL PRIMARY KEY,
  guest_name  VARCHAR(100) NOT NULL,
  message     TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE, -- admin 可隱藏不當留言
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `guestbook_likes` — 防止重複按愛心

```sql
CREATE TABLE guestbook_likes (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES guestbook_posts(id) ON DELETE CASCADE,
  fingerprint VARCHAR(255) NOT NULL, -- 瀏覽器 fingerprint 或 IP
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, fingerprint)
);
```

### `menu_categories` — 菜單分類

```sql
CREATE TABLE menu_categories (
  id            SERIAL PRIMARY KEY,
  name_zh       VARCHAR(100) NOT NULL,
  name_en       VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE
);
```

### `menu_items` — 菜單項目

```sql
CREATE TABLE menu_items (
  id              SERIAL PRIMARY KEY,
  category_id     INTEGER NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_zh         VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  description_zh  TEXT,
  description_en  TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE
);
```

### `rsvp_guests` — 賓客出席確認（綁定電話號碼）

```sql
CREATE TABLE rsvp_guests (
  id                   SERIAL PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  phone                VARCHAR(20)  NOT NULL UNIQUE, -- 每支電話只能填一次
  attending            VARCHAR(10)  NOT NULL,         -- 'yes' | 'no'
  adult_count          INTEGER NOT NULL DEFAULT 1,    -- 出席大人人數
  child_count          INTEGER NOT NULL DEFAULT 0,    -- 出席小孩人數
  meal_preference      VARCHAR(50),                  -- 'regular' | 'vegetarian' | 'vegan'
  dietary_restrictions TEXT,                         -- 過敏或特殊需求
  note                 TEXT,                         -- 給新人的話
  table_number         INTEGER,                      -- admin 指定桌號
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## API Routes 架構

```
/api/
├── auth/
│   ├── login/        POST  — 登入，回傳 JWT
│   └── logout/       POST  — 清除 session
│
├── config/           GET   — 讀取所有 site_config
│                     PUT   — 更新某個 section 的設定（需 admin auth）
│
├── gallery/          GET   — 讀取所有可見相片
│                     POST  — 上傳相片（需 admin auth）
├── gallery/[id]/
│                     PATCH — 更新相片資訊（需 admin auth）
│                     DELETE — 刪除相片（需 admin auth）
│
├── guestbook/        GET   — 讀取所有已核准留言
│                     POST  — 新增留言（公開）
├── guestbook/[id]/
│   └── like/         POST  — 按愛心（公開，有 fingerprint 防重複）
│
├── menu/
│   ├── categories/   GET, POST, PUT, DELETE（需 admin auth）
│   └── items/        GET, POST, PUT, DELETE（需 admin auth）
│
└── rsvp/             GET   — 讀取所有 RSVP（需 admin auth）
                      POST  — 新增或更新 RSVP（綁電話，公開）
```

---

## 目錄結構（目標）

```
my-app/
├── app/
│   ├── api/                  ← 所有 API routes
│   │   ├── auth/
│   │   ├── config/
│   │   ├── gallery/
│   │   ├── guestbook/
│   │   ├── menu/
│   │   └── rsvp/
│   ├── admin/                ← 後台（protected）
│   │   ├── dashboard/        ← 儀表板（RSVP 統計、留言數）
│   │   ├── gallery/
│   │   ├── guestbook/
│   │   ├── menu/
│   │   ├── rsvp/
│   │   ├── settings/         ← 網站設定（home, location, theme）
│   │   ├── layout.tsx        ← Admin layout + auth guard
│   │   └── login/            ← 登入頁
│   ├── rsvp/                 ← 公開 RSVP 填寫頁
│   ├── gallery/
│   ├── menu/
│   ├── location/
│   └── components/
├── lib/
│   ├── db.ts                 ← PostgreSQL connection pool
│   ├── auth.ts               ← JWT helpers (sign / verify)
│   ├── validations/          ← Zod schemas
│   │   ├── rsvp.ts
│   │   ├── guestbook.ts
│   │   └── config.ts
│   └── queries/              ← SQL query functions（Data Access Layer）
│       ├── config.ts
│       ├── gallery.ts
│       ├── guestbook.ts
│       ├── menu.ts
│       └── rsvp.ts
├── middleware.ts              ← Route protection (admin auth)
├── migrations/               ← SQL migration files
│   ├── 001_create_admins.sql
│   ├── 002_create_site_config.sql
│   ├── 003_create_gallery.sql
│   ├── 004_create_guestbook.sql
│   ├── 005_create_menu.sql
│   └── 006_create_rsvp.sql
└── scripts/
    ├── migrate.ts            ← 執行 migration 的腳本
    └── seed.ts               ← 初始資料（預設 admin 帳號、初始 config）
```

---

## 開發階段路線圖

### Phase 1｜資料庫基礎（現在開始）

- [x] 設計並建立所有 SQL migration 檔案
- [x] 建立 `scripts/migrate.ts` 執行 migration
- [x] 建立 `scripts/seed.ts` 插入初始資料
- [x] 測試所有資料表成功建立

### Phase 2｜Data Access Layer

- [x] `lib/queries/config.ts` — 讀寫 site_config
- [x] `lib/queries/guestbook.ts` — CRUD + like 邏輯
- [x] `lib/queries/gallery.ts` — CRUD
- [x] `lib/queries/menu.ts` — CRUD
- [x] `lib/queries/rsvp.ts` — RSVP 邏輯（phone upsert）

### Phase 3｜API Routes

- [x] Config API（替換掉現有的 JSON 檔案方案）
- [x] Guestbook API（含 fingerprint like 防重複）
- [x] Gallery API
- [x] Menu API
- [x] RSVP API

### Phase 4｜身份驗證

- [x] 安裝 `jose`、`bcryptjs`
- [x] `lib/auth.ts` — JWT sign / verify helpers
- [x] `app/admin/login/page.tsx` — 登入頁
- [x] `app/api/auth/login/route.ts` — 登入 API
- [x] `middleware.ts` — 保護所有 `/admin` routes

### Phase 5｜Admin 後台強化

- [ ] Dashboard — RSVP 統計、留言數、出席率
- [ ] RSVP 管理 — 列表、指定桌號、匯出 CSV
- [ ] 留言板管理 — 審核 / 隱藏
- [ ] 相片管理 — 上傳（Supabase Storage）、排序、刪除
- [ ] 網站設定 — 所有頁面內容可編輯
- [ ] 主題設定 — 顏色、字體、背景

### Phase 6｜圖片上傳

- [ ] 設定 Supabase Storage bucket
- [ ] 上傳 API (`/api/gallery` POST with multipart/form-data)
- [ ] Admin 相片上傳 UI

### Phase 7｜部署

- [ ] Supabase 雲端資料庫設定
- [ ] 環境變數設定（`.env.production`）
- [ ] Vercel 部署
- [ ] 自訂網域 + HTTPS
- [ ] 部署後 Migration 執行

---

## 環境變數說明

```env
# 本地開發
DATABASE_URL=postgresql://wedding:wedding0716@localhost:5433/wedding

# 生產環境（Supabase）
DATABASE_URL=postgresql://...supabase...

# JWT
JWT_SECRET=（至少 32 字元隨機字串）
JWT_EXPIRES_IN=7d

# Image Storage
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_STORAGE_BUCKET=wedding-photos
```

---

## 設計原則

1. **Zod 驗證一切** — 所有 API input 都要用 Zod schema 驗證
2. **分層架構** — UI → API Route → Query Function → DB（不跳層）
3. **Migration 管理** — 每次 schema 變動都要有對應的 migration 檔
4. **環境分離** — 本地、測試、生產環境完全分開
5. **Admin Auth 保護** — 所有寫入操作都需要驗證 JWT
6. **SQL Injection 防護** — 永遠用 parameterized queries，不拼接 SQL 字串
