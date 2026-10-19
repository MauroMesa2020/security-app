CREATE TABLE projects (
    id UUID PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    path TEXT NOT NULL,
    last_static_analysis TIMESTAMPTZ,
    last_dynamic_analysis TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);