
import type { AnalysisDetails } from "../pages/AnalysesTypes";

interface AnalysisDetailsModalProps {
    analysis: AnalysisDetails;
    onClose: () => void;
}

export default function AnalysisDetailsModal({
    analysis,
    onClose,
}: AnalysisDetailsModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="analysis-modal-title"
                className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl md:p-8"
            >
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                            {analysis.analysis_type} analysis
                        </p>

                        <h2
                            id="analysis-modal-title"
                            className="mt-2 font-serif text-2xl"
                        >
                            Analysis details
                        </h2>

                        <p className="mt-2 text-sm text-green-400">
                            {new Date(
                                analysis.created_at
                            ).toLocaleString()}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Metric
                        label="Findings"
                        value={analysis.summary?.total_findings ?? analysis.findings.length}
                    />
                    <Metric
                        label="Errors"
                        value={analysis.summary?.severity_counts?.ERROR ?? 0}
                    />
                    <Metric
                        label="Warnings"
                        value={analysis.summary?.severity_counts?.WARNING ?? 0}
                    />
                    <Metric
                        label="Info"
                        value={analysis.summary?.severity_counts?.INFO ?? 0}
                    />
                </div>

                <div className="mt-8">
                    <h3 className="mb-4 font-serif text-xl">
                        Findings
                    </h3>

                    {analysis.findings.length === 0 ? (
                        <p className="rounded-xl border border-white/10 p-5 text-sm text-zinc-400">
                            No findings were reported.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {analysis.findings.map((finding) => (
                                <article
                                    key={finding.id}
                                    className="rounded-xl border border-white/10 bg-black p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <h4 className="break-words font-medium text-zinc-100">
                                            {finding.name}
                                        </h4>

                                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase text-zinc-300">
                                            {finding.severity ?? "Unknown"}
                                        </span>
                                    </div>

                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                                        {finding.description ??
                                            "No description available."}
                                    </p>

                                    {finding.file_path && (
                                        <p className="mt-4 break-all font-mono text-xs text-green-400">
                                            {finding.file_path}
                                            {finding.line_start != null &&
                                                `:${finding.line_start}`}
                                            {finding.line_end != null &&
                                                finding.line_end !== finding.line_start &&
                                                `-${finding.line_end}`}
                                        </p>
                                    )}

                                    {finding.code_fragment && (
                                        <pre className="mt-4 overflow-x-auto rounded-lg border border-white/5 bg-zinc-950 p-4 text-xs text-zinc-300">
                                            <code>{finding.code_fragment}</code>
                                        </pre>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function Metric({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-black p-4">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                {label}
            </p>
            <p className="mt-2 font-serif text-2xl text-zinc-100">
                {value}
            </p>
        </div>
    );
}
