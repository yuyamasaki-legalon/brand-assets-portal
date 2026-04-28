CREATE TABLE IF NOT EXISTS comment_threads (
  id TEXT PRIMARY KEY,
  deployment_scope TEXT NOT NULL,
  page_route TEXT NOT NULL,
  anchor_x_percent REAL,
  anchor_y_percent REAL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comment_threads_scope_route_updated
  ON comment_threads (deployment_scope, page_route, updated_at DESC);

CREATE TABLE IF NOT EXISTS comment_messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (thread_id) REFERENCES comment_threads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comment_messages_thread_created
  ON comment_messages (thread_id, created_at ASC);
