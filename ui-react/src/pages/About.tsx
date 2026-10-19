const guides = [
    {
        number: "01",
        title: "Static Analysis",
        tag: "Semgrep",
        tagColor: "text-red-300 border-red-900/60 bg-red-950/30",
        description:
            "Static analysis examines the source code of a project without executing the application. It helps identify potential security vulnerabilities, insecure coding practices, and suspicious patterns.",
        action:
            "Click the Static button on a project card to run a Semgrep scan. The application analyzes the project's source code and stores the results for later review.",
        image: "/images/about/static-analysis.png",
        imageAlt: "Screenshot of the Static analysis button and Semgrep results",
    },
    {
        number: "02",
        title: "Dynamic Analysis",
        tag: "OWASP ZAP",
        tagColor: "text-green-300 border-green-900/60 bg-green-950/30",
        description:
            "Dynamic analysis tests a running web application from the outside. It can help identify issues such as security misconfigurations, exposed information, and common web vulnerabilities.",
        action:
            "Click the Dynamic button on a project card to initiate an OWASP ZAP scan against the configured target URL. The application stores the scan results so they can be reviewed later.",
        image: "/images/about/dynamic-analysis.png",
        imageAlt: "Screenshot of the Dynamic analysis button and OWASP ZAP results",
    },
    {
        number: "03",
        title: "View Project Results",
        tag: "Project History",
        tagColor: "text-sky-300 border-sky-900/60 bg-sky-950/30",
        description:
            "Each project has its own analysis history. Every time a static or dynamic scan is saved, it appears as a separate entry, allowing you to keep track of previous executions.",
        action:
            "Click anywhere on the project card itself, outside the Static and Dynamic buttons, to open the project's analysis history. The history contains the executions associated with that project.",
        image: "/images/about/project-history.png",
        imageAlt: "Screenshot of a project card and its analysis history",
    },
    {
        number: "04",
        title: "Inspect an Analysis",
        tag: "Detailed Findings",
        tagColor: "text-amber-300 border-amber-900/60 bg-amber-950/30",
        description:
            "Every saved execution has its own details. Reviewing individual runs helps you understand what was detected and which parts of the application may require attention.",
        action:
            "Inside the project history, click an analysis card identified by its execution date. This opens the details for that specific scan, including available findings, severity levels, affected files, line numbers, and code snippets.",
        image: "/images/about/analysis-details.png",
        imageAlt: "Screenshot of an analysis card and its detailed findings",
    },
];

export default function About() {
    return (
        <main className="min-h-screen bg-black px-6 py-16 text-zinc-100 md:px-10">
            <div className="mx-auto max-w-6xl">

                {/* Hero */}
                <header className="mb-16 max-w-3xl">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-green-400">
                        Documentation / User Guide
                    </p>

                    <h1 className="font-serif text-4xl leading-tight tracking-wide md:text-6xl">
                        Security Analysis
                        <span className="block text-zinc-500">
                            Made Understandable.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
                        This application provides a centralized way to run
                        security analyses on web projects, review potential
                        vulnerabilities, and explore the results of previous
                        scans. Use the guide below to learn how to run an
                        analysis and navigate your project's history.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <span className="rounded-full border border-red-900/60 bg-red-950/30 px-4 py-2 text-xs text-red-300">
                            Static · Semgrep
                        </span>
                        <span className="rounded-full border border-green-900/60 bg-green-950/30 px-4 py-2 text-xs text-green-300">
                            Dynamic · OWASP ZAP
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400">
                            Analysis History
                        </span>
                    </div>
                </header>

                {/* Overview */}
                <section className="mb-20">
                    <div className="mb-7">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-green-400">
                            Overview
                        </p>
                        <h2 className="font-serif text-2xl md:text-3xl">
                            How does it work?
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black p-6">
                            <span className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/10 text-lg text-zinc-300">
                                01
                            </span>
                            <h3 className="mb-3 text-lg">Choose a project</h3>
                            <p className="text-sm leading-7 text-zinc-500">
                                Select the type of security scan you want to
                                perform from the project's card.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black p-6">
                            <span className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/10 text-lg text-zinc-300">
                                02
                            </span>
                            <h3 className="mb-3 text-lg">Run an analysis</h3>
                            <p className="text-sm leading-7 text-zinc-500">
                                Semgrep analyzes source code, while OWASP ZAP
                                tests the configured running web application.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black p-6">
                            <span className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/10 text-lg text-zinc-300">
                                03
                            </span>
                            <h3 className="mb-3 text-lg">Review the findings</h3>
                            <p className="text-sm leading-7 text-zinc-500">
                                Open the project history and select a dated
                                execution to inspect its saved results.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Detailed instructions */}
                <section>
                    <div className="mb-10">
                        <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-green-400">
                            Step-by-step instructions
                        </p>
                        <h2 className="font-serif text-2xl md:text-3xl">
                            Using the application
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
                            Follow these steps to execute scans and navigate
                            through the results. Screenshots will help you
                            identify each part of the interface.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {guides.map((guide) => (
                            <article
                                key={guide.number}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-black"
                            >
                                <div className="grid md:grid-cols-[1fr_0.9fr]">
                                    {/* Text */}
                                    <div className="p-6 md:p-9">
                                        <div className="mb-6 flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-sm text-green-400">
                                                / {guide.number}
                                            </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider ${guide.tagColor}`}
                                            >
                                                {guide.tag}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-2xl">
                                            {guide.title}
                                        </h3>

                                        <p className="mt-5 text-sm leading-7 text-zinc-400">
                                            {guide.description}
                                        </p>

                                        <div className="mt-6 border-l-2 border-green-900/80 pl-4">
                                            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-green-400">
                                                What to do
                                            </p>
                                            <p className="text-sm leading-7 text-zinc-300">
                                                {guide.action}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Screenshot placeholder */}
                                    <div className="flex min-h-64 flex-col border-t border-white/10 bg-black/40 p-5 md:border-l md:border-t-0 md:p-7">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                                                Interface preview
                                            </span>
                                            <span className="font-mono text-[10px] text-zinc-600">
                                                IMG_{guide.number}
                                            </span>
                                        </div>

                                       <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                                            <img
                                                src={guide.image}
                                                alt={guide.imageAlt}
                                                className="h-full w-full object-fill"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Important note */}
                <section className="mt-16 rounded-2xl border border-green-900/40 bg-green-950/10 p-6 md:p-8">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-green-400">
                        Important
                    </p>
                    <h2 className="font-serif text-xl">
                        Running scans is only the first step.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-zinc-400">
                        Always review the findings before drawing conclusions.
                        Automated tools can produce false positives and may
                        not detect every vulnerability. Dynamic scans should
                        only target applications you are authorized to test,
                        preferably in a controlled environment.
                    </p>
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-white/10 pt-6">
                    <p className="text-xs leading-6 text-zinc-600">
                        Security Analysis Platform · User Guide
                    </p>
                </footer>
            </div>
        </main>
    );
}
