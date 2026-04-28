ALTER TABLE comment_threads ADD COLUMN anchor_kind TEXT;
ALTER TABLE comment_threads ADD COLUMN anchor_id TEXT;
ALTER TABLE comment_threads ADD COLUMN anchor_label TEXT;
ALTER TABLE comment_threads ADD COLUMN anchor_target_kind TEXT;
ALTER TABLE comment_threads ADD COLUMN anchor_context_label TEXT;

CREATE INDEX IF NOT EXISTS idx_comment_threads_scope_route_anchor_id
  ON comment_threads (deployment_scope, page_route, anchor_id);
