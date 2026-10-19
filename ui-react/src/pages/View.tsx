
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnalysisCard from "../components/AnalysesCard";
import AnalysisDetailsModal from "../components/AnalysisDetailsModal";
import type {
    AnalysisItem,
    AnalysisDetails,
    ApiResponse,
} from "./AnalysesTypes";

export default function View() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] =
        useState<AnalysisDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) {
            
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("Project ID is missing.");
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function fetchAnalyses() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/analysis/projects/${projectId}/analyses`,
                    { signal: controller.signal }
                );

                const result: ApiResponse<AnalysisItem[]> =
                    await response.json();

                if (!response.ok || result.status !== "success") {
                    throw new Error(
                        result.message ?? "Could not load analyses."
                    );
                }

                setAnalyses(result.data);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Could not load analyses."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchAnalyses();

        return () => controller.abort();
    }, [projectId]);

    async function openAnalysis(analysisId: string) {
        try {
            setDetailsLoading(true);
            setError(null);

            const response = await fetch(
                `/api/analysis/analyses/${analysisId}`
            );

            const result: ApiResponse<AnalysisDetails> =
                await response.json();

            if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message ?? "Could not load analysis details."
                );
            }

            setSelectedAnalysis(result.data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not load analysis details."
            );
        } finally {
            setDetailsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black px-6 py-10 text-zinc-100 md:px-10">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-8 text-sm text-zinc-400 transition hover:text-green-400"
                >
                    ← Back to projects
                </button>

                <header className="mb-10">
                    <p className="mb-3 text-xs uppercase tracking-[0.25em] text-green-400">
                        Security project
                    </p>

                    <h1 className="font-serif text-3xl md:text-4xl">
                        Analysis history
                    </h1>

                    <p className="mt-3 break-all font-mono text-xs text-zinc-500">
                        Project ID: {projectId}
                    </p>
                </header>

                {loading && (
                    <p className="text-sm text-zinc-400">
                        Loading analysis history...
                    </p>
                )}

                {!loading && error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300"
                    >
                        {error}
                    </div>
                )}

                {!loading && !error && analyses.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8">
                        <h2 className="text-lg text-zinc-200">
                            No analyses yet
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Run a static or dynamic analysis from the project
                            card. Its results will appear here once saved.
                        </p>
                    </div>
                )}

                {!loading && analyses.length > 0 && (
                    <section>
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-sm uppercase tracking-widest text-zinc-400">
                                Executions
                            </h2>

                            <span className="text-xs text-zinc-500">
                                {analyses.length}{" "}
                                {analyses.length === 1
                                    ? "analysis"
                                    : "analyses"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {analyses.map((analysis) => (
                                <AnalysisCard
                                    key={analysis.id}
                                    analysis={analysis}
                                    onClick={() =>
                                        openAnalysis(analysis.id)
                                    }
                                />
                            ))}
                        </div>
                    </section>
                )}

                {detailsLoading && (
                    <p className="mt-6 text-sm text-zinc-400">
                        Loading analysis details...
                    </p>
                )}

                {selectedAnalysis && (
                    <AnalysisDetailsModal
                        analysis={selectedAnalysis}
                        onClose={() => setSelectedAnalysis(null)}
                    />
                )}
            </div>
        </main>
    );
}
