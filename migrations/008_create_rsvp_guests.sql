CREATE TABLE rsvp_guests(
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 phone VARCHAR(20)  NOT NULL UNIQUE,
 attending VARCHAR(10)  NOT NULL,         -- 'yes' | 'no'
 adult_count INTEGER NOT NULL DEFAULT 1,
 child_count INTEGER NOT NULL DEFAULT 0,    -- 出席小孩人數
 meal_preference VARCHAR(50),    -- 'regular' | 'vegetarian' | 'vegan'
 note TEXT, 
  table_number  INTEGER,   -- admin 指定桌號
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
)