CREATE TABLE IF NOT EXISTS company_submissions (
  id TEXT PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('add', 'edit')),
  company_name TEXT NOT NULL,
  company_slug TEXT,
  website TEXT,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_submissions_email_idx ON company_submissions (submitter_email);
CREATE INDEX IF NOT EXISTS company_submissions_status_idx ON company_submissions (status);
