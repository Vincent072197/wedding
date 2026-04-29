CREATE TABLE gallery_photos(
  id SERIAL PRIMARY KEY,
  url VARCHAR(1000) NOT NULL,
  caption TEXT,
  alt_text VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_by INTEGER REFERENCES admins(id) ON DELETE SET NULL, -- admins(id) 如果被移除，同步set該admin 存入的資料變成 null
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);