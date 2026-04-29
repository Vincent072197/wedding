CREATE TABLE menu_categories (
  id            SERIAL PRIMARY KEY,
  name_zh       VARCHAR(100) NOT NULL,
  name_en       VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE
);