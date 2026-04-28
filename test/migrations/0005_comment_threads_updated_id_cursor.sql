CREATE INDEX IF NOT EXISTS idx_comment_threads_scope_route_updated_id
  ON comment_threads (deployment_scope, page_route, updated_at DESC, id DESC);
