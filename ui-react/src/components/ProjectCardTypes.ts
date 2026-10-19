export interface Project {
    id: string;
    owner: string;
    url: string;
    path: string;
    last_static_analysis: string | null;
    last_dynamic_analysis: string | null;
    created_at: string;
}