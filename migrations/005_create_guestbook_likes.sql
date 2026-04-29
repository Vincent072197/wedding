CREATE TABLE guestbook_likes (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES guestbook_posts(id) ON DELETE CASCADE,
  fingerprint VARCHAR(255) NOT NULL, -- 瀏覽器 fingerprint 或 IP
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, fingerprint)
);