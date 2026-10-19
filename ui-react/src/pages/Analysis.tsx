
import { useEffect, useState } from "react";
import type {Project} from "../components/ProjectCardTypes";
import ProjectCard from "../components/ProjectCard";

interface ProjectsResponse {
    status: "success" | "error";
    data?: Project[];
    message?: string;
}

export default function Analysis() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProjects() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/db/get-projects", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    signal: controller.signal,
                });

                const result: ProjectsResponse = await response.json();

                if (!response.ok || result.status !== "success") {
                throw new Error(
                    result.message ?? "Failed to load projects."
                );
                }

                setProjects(result.data ?? []);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        return () => controller.abort();
    }, []);

    return (
        <main className="min-h-screen bg-black px-6 py-12 text-white md:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Cargando */}
                {loading && (
                    <p className="text-sm text-zinc-400">
                        Loading projects...
                    </p>
                )}

                {/* Error */}
                {!loading && error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-900/50 bg-red-950/30 p-5"
                >
                    <p className="font-medium text-red-200">
                        Could not load projects
                    </p>

                    <p className="mt-2 text-sm text-red-300">
                        {error}
                    </p>

                    <p className="mt-3 text-sm text-zinc-400">
                        Check that Flask and PostgreSQL are running.
                    </p>
                </div>
                )}

                {/* Sin proyectos */}
                {!loading && !error && projects.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
                        <h2 className="text-lg font-medium text-white">
                            No projects yet
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Register a project to see it here.
                        </p>
                    </div>
                )}

                {/* Proyectos */}
                {!loading && !error && projects.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
