
import type { AnalysisItem } from "../pages/AnalysesTypes";

interface AnalysisCardProps {
    analysis: AnalysisItem;
    onClick: () => void;
}

export default function AnalysisCard({
    analysis,
    onClick,
}: AnalysisCardProps) {
    const isStatic = analysis.analysis_type === "static";

    const date = new Date(analysis.created_at).toLocaleString();

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick();
                }
            }}
            className="group min-w-0 cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/70 to-black p-5 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                        Executed at
                    </p>

                    <h2 className="break-words font-serif text-lg text-green-400">
                        {date}
                    </h2>
                </div>

                <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        isStatic
                            ? "border-red-900/60 bg-red-950/40 text-red-300"
                            : "border-green-800/60 bg-green-900/40 text-green-300"
                    }`}
                >
                    {isStatic ? "Static" : "Dynamic"}
                </span>
            </div>

            <div className="mt-6">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                    Analysis
                </p>

                <h3 className="break-words font-serif text-xl text-zinc-100">
                    {isStatic ? "Semgrep analysis" : "Dynamic analysis"}
                </h3>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-4">
                <span className="text-xs text-zinc-400">
                    Findings:{" "}
                    <span className="text-zinc-100">
                        {analysis.findings_count}
                    </span>
                </span>

                <span className="text-xs text-zinc-400">
                    Errors:{" "}
                    <span className="text-red-300">
                        {analysis.summary?.severity_counts?.ERROR ?? 0}
                    </span>
                </span>

                <span className="text-xs text-zinc-400">
                    Warnings:{" "}
                    <span className="text-amber-300">
                        {analysis.summary?.severity_counts?.WARNING ?? 0}
                    </span>
                </span>

                <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-zinc-500 transition group-hover:text-green-400">
                    View details →
                </span>
            </div>
        </article>
    );
}
