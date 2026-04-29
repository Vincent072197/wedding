CREATE TABLE guestbook_posts(
  id SERIAL PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  message     TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE, -- admin 可隱藏不當留言
   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);