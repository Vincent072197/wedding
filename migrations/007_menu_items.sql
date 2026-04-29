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