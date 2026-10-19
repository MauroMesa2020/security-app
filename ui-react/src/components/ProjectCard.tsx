
import { useState } from "react";
import type { Project } from "./ProjectCardTypes";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const [loading, setLoading] = useState<"static" | "dynamic" | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function runAnalysis(type: "static" | "dynamic") {
        setLoading(type);
        setMessage(null);
        setError(null);

        try {
            const endpoint =
                type === "dynamic"
                ? "/api/analysis/dynamic-analysis"
                : "/api/analysis/static-analysis";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    id: project.id,
                    owner: project.owner,
                    url: project.url,
                    path: project.path,
                }),
            });

        const responseText = await response.text();

        let result: {
            status?: string;
            message?: string;
            data?: unknown;
        };

        try {
            result = JSON.parse(responseText);
        } catch {
            throw new Error(
                `Server returned HTTP ${response.status} with a non-JSON response.`
            );
        }

        if (!response.ok || result.status !== "success") {
            throw new Error(
                result.message ?? `Failed to run ${type} analysis.`
            );
        }

        setMessage(
            `${type === "static" ? "Static" : "Dynamic"} analysis request completed.`
        );
        } catch (err) {
        setError(
            err instanceof Error
            ? err.message
            : "An unexpected error occurred."
        );
        } finally {
        setLoading(null);
        }
    }

    
    return (
        <article
            role="link"
            tabIndex={0}
            onClick={() => navigate(`/analysis/projects/${project.id}`)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/analysis/projects/${project.id}`);
                }
            }}
            className="group min-w-0 cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/70 to-black p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
            >
        {/* Encabezado: propietario a la izquierda, acciones a la derecha */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                        Owner
                    </p>

                <h2 className="break-words font-serif text-xl tracking-wide text-zinc-100">
                    {project.owner}
                </h2>
            </div>

            {/* Acciones compactas */}
            <div className="flex shrink-0 items-center gap-2 pt-1">
                <button
                    type="button"
                    disabled={loading !== null}
                    onClick={(event) => {
                        event.stopPropagation();
                        runAnalysis("static");
                    }}
                    className="w-20 rounded-full border border-red-900/60 bg-red-950/40 px-2 py-1.5 text-center text-xs font-medium tracking-wide text-red-300 transition hover:border-red-700 hover:bg-red-900/50 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading === "static" ? "Running..." : "Static"}
                </button>

                <button
                    type="button"
                    disabled={loading !== null}
                    onClick={(event) => {
                        event.stopPropagation();
                        runAnalysis("dynamic");
                    }}
                    className="w-20 rounded-full border border-green-800/60 bg-green-900/40 px-2 py-1.5 text-center text-xs font-medium tracking-wide text-green-300 transition hover:border-green-600 hover:bg-green-900/40 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading === "dynamic" ? "Running..." : "Dynamic"}
                </button>
            </div>
        </div>

        {/* URL */}
        <div className="mt-6">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                URL
            </p>

            <p className="break-all font-mono text-xs leading-relaxed text-zinc-400">
                {project.url}
            </p>
        </div>

        {/* Separador */}
        <div className="mt-5 border-t border-white/[0.07] pt-3">
            <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                    Security project
                </span>

                {loading && (
                    <span className="text-[10px] tracking-wide text-zinc-400">
                        Analysis in progress
                    </span>
                )}

                {!loading && message && (
                    <span role="status" className="text-[10px] text-emerald-400">
                        View results
                    </span>
                )}

                {!loading && error && (
                    <span
                        role="alert"
                        title={error}
                        className="text-[10px] text-red-400"
                    >
                        Analysis failed
                    </span>
                )}
            </div>
        </div>
        </article>
    );
}
