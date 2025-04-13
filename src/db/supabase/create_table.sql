
-- Table for storing category groups
CREATE TABLE IF NOT EXISTS public.category_groups (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) TABLESPACE pg_default;

-- Table for storing category values
CREATE TABLE IF NOT EXISTS public.category_values (
  id INTEGER PRIMARY KEY,
  type INTEGER NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tool_count INTEGER NOT NULL DEFAULT 0,
  group_id INTEGER NOT NULL,
  top_tool_count INTEGER,
  top_visited_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (group_id) REFERENCES public.category_groups(id)
) TABLESPACE pg_default;

