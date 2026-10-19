CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id),
    analysis_type VARCHAR(20) NOT NULL,
    summary JSONB,
    raw_payload JSONB
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);