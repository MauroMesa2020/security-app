export interface Finding {
    id: number;
    name: string;
    description: string | null;
    severity: string | null;
    file_path: string | null;
    line_start: number | null;
    line_end: number | null;
    code_fragment: string | null;
}

export interface AnalysisSummary {
    total_findings: number;
    severity_counts: Record<string, number>;
    execution_time: number;
    errors_count: number;
}

export interface AnalysisItem {
    id: string;
    project_id: string;
    analysis_type: string;
    created_at: string;
    summary: AnalysisSummary | null;
    findings_count: number;
}

export interface AnalysisDetails extends AnalysisItem {
    findings: Finding[];
    raw_payload?: Record<string, unknown>;
}

export interface ApiResponse<T> {
    status: "success" | "error";
    data: T;
    message?: string;
}
