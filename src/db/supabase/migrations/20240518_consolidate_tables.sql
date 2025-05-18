-- 1. 首先向 submissions 表添加必要的列
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS tool_type TEXT DEFAULT 'saas';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS server_type TEXT DEFAULT 'other';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS pricing_model TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS documentation_url TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS version TEXT;

-- 2. 将数据从 ai_tools_submissions 迁移到 submissions
UPDATE submissions s
SET 
  tool_type = a.tool_type,
  pricing_model = a.pricing_model,
  features = a.features
FROM ai_tools_submissions a
WHERE s.id = a.id;

-- 3. 将数据从 mcp_servers_submissions 迁移到 submissions
UPDATE submissions s
SET 
  server_type = m.server_type,
  github_url = m.github_url,
  documentation_url = m.documentation_url,
  version = m.version
FROM mcp_servers_submissions m
WHERE s.id = m.id;

-- 4. 删除外键约束（如果存在）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ai_tools_submissions_id_fkey' 
    AND table_name = 'ai_tools_submissions'
  ) THEN
    ALTER TABLE ai_tools_submissions DROP CONSTRAINT ai_tools_submissions_id_fkey;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'mcp_servers_submissions_id_fkey' 
    AND table_name = 'mcp_servers_submissions'
  ) THEN
    ALTER TABLE mcp_servers_submissions DROP CONSTRAINT mcp_servers_submissions_id_fkey;
  END IF;
END $$;

-- 5. 删除表
DROP TABLE IF EXISTS ai_tools_submissions;
DROP TABLE IF EXISTS mcp_servers_submissions; 