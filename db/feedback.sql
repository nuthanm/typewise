CREATE TABLE IF NOT EXISTS site_feedback (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  helped TEXT NOT NULL CHECK (helped IN ('yes', 'somewhat', 'no')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_feedback_helped_idx ON site_feedback (helped);
