CREATE TABLE findings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    analysis_id UUID NOT NULL REFERENCES analyses(id),
    name TEXT NOT NULL,
    description TEXT,
    severity VARCHAR(20),
    file_path TEXT,
    line_start INTEGER,
    line_end INTEGER,
    code_fragment TEXT,
    url TEXT,
    http_method VARCHAR(10),
    parameter TEXT,
    evidence TEXT,
    payload JSONB
);