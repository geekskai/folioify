-- 修改submissions表，确保所有需要的字段存在
ALTER TABLE IF EXISTS submissions 
ADD COLUMN IF NOT EXISTS tool_type TEXT,
ADD COLUMN IF NOT EXISTS server_type TEXT,
ADD COLUMN IF NOT EXISTS pricing_model TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS documentation_url TEXT,
ADD COLUMN IF NOT EXISTS version TEXT;

-- 设置字段默认值
ALTER TABLE IF EXISTS submissions 
ALTER COLUMN tool_type SET DEFAULT 'saas',
ALTER COLUMN server_type SET DEFAULT 'other';

-- 为category_type创建CHECK约束
DO $$
BEGIN
  -- 删除旧的约束（如果存在）
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'submissions_category_type_check'
  ) THEN
    ALTER TABLE submissions DROP CONSTRAINT submissions_category_type_check;
  END IF;
  
  -- 添加新的约束
  ALTER TABLE submissions 
  ADD CONSTRAINT submissions_category_type_check 
  CHECK (category_type IN ('ai_tools', 'mcp_servers'));
END
$$;

-- 如果没有自动更新updated_at的触发器，添加一个
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_submissions_updated_at'
  ) THEN
    -- 创建触发器函数（如果不存在）
    CREATE OR REPLACE FUNCTION update_modified_column() 
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- 创建触发器
    CREATE TRIGGER set_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  END IF;
END
$$;

-- 设置创建和更新时间的默认值
ALTER TABLE IF EXISTS submissions
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at SET DEFAULT now();

-- 删除旧表（确保备份数据或确认数据已合并）
DROP TABLE IF EXISTS ai_tools_submissions;
DROP TABLE IF EXISTS mcp_servers_submissions;

-- 确保RLS策略正确设置
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 创建所有用户可以插入的策略
CREATE POLICY IF NOT EXISTS "Allow inserts for all users" 
ON submissions FOR INSERT 
TO PUBLIC
WITH CHECK (true);

-- 创建只有拥有者可以更新的策略
CREATE POLICY IF NOT EXISTS "Allow updates for authenticated users on their submissions" 
ON submissions FOR UPDATE 
USING (auth.uid() = submitted_by); 