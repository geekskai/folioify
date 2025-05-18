-- Simplify submissions table structure

-- 1. First, rename category_type to type and convert it to integer
ALTER TABLE IF EXISTS submissions
ADD COLUMN IF NOT EXISTS type INTEGER;

-- 2. Update existing records
UPDATE submissions
SET type = CASE 
    WHEN category_type = 'ai_tools' THEN 0
    WHEN category_type = 'mcp_servers' THEN 1
    ELSE 2
END
WHERE category_type IS NOT NULL;

-- 3. Drop all unnecessary columns
ALTER TABLE IF EXISTS submissions
DROP COLUMN IF EXISTS category_type,
DROP COLUMN IF EXISTS tool_type,
DROP COLUMN IF EXISTS server_type,
DROP COLUMN IF EXISTS pricing_model,
DROP COLUMN IF EXISTS github_url,
DROP COLUMN IF EXISTS documentation_url,
DROP COLUMN IF EXISTS version,
DROP COLUMN IF EXISTS features;

-- 4. Ensure remaining columns have correct constraints
ALTER TABLE IF EXISTS submissions
ALTER COLUMN type SET NOT NULL,
ALTER COLUMN type SET DEFAULT 0;

-- 5. Add check constraint for type values
DO $$
BEGIN
  -- 删除旧的约束（如果存在）
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'submissions_type_check'
  ) THEN
    ALTER TABLE submissions DROP CONSTRAINT submissions_type_check;
  END IF;
  
  -- 添加新的约束
  ALTER TABLE submissions 
  ADD CONSTRAINT submissions_type_check 
  CHECK (type IN (0, 1, 2));
END
$$;

-- 6. Drop old tables if they still exist
DROP TABLE IF EXISTS ai_tools_submissions;
DROP TABLE IF EXISTS mcp_servers_submissions;

-- 7. Ensure RLS policies are updated
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public insert policy
CREATE POLICY IF NOT EXISTS "Allow inserts for all users" 
ON submissions FOR INSERT 
TO PUBLIC
WITH CHECK (true);

-- Update policy for authenticated users
CREATE POLICY IF NOT EXISTS "Allow updates for authenticated users on their submissions" 
ON submissions FOR UPDATE 
USING (auth.uid() = submitted_by); 