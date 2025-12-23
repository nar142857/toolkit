-- Cloudflare D1 数据库表结构

-- 工具统计表
CREATE TABLE IF NOT EXISTS tool_stats (
  tool_id INTEGER PRIMARY KEY,
  usage_count INTEGER DEFAULT 0,
  today_usage INTEGER DEFAULT 0,
  last_used TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表 (可选)
CREATE TABLE IF NOT EXISTS user_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tool_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tool_id)
);

-- 工具反馈表 (可选)
CREATE TABLE IF NOT EXISTS tool_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_id INTEGER NOT NULL,
  user_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_tool_stats_usage_count ON tool_stats(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_feedback_tool_id ON tool_feedback(tool_id);