import React, { useRef, useState } from "react";
import { registerProject } from "../services/PageService";

type DirectoryInputProps =
    React.InputHTMLAttributes<HTMLInputElement> & {
        webkitdirectory?: string;
        directory?: string;
    };

const DirectoryInput =
    React.forwardRef<HTMLInputElement, DirectoryInputProps>(
        (props, ref) => <input {...props} ref={ref} />
    );

DirectoryInput.displayName = "DirectoryInput";

type RegisterPageModalProps = {
    onClose: () => void;
    };

export default function RegisterPageModal({
    onClose,
}: RegisterPageModalProps) {
    const [owner, setOwner] = useState("");
    const [url, setUrl] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const folderInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(
        event.target.files ?? []
        );

        const ignoredDirectories = [
        "node_modules",
        ".venv",
        "venv",
        ".git",
        "dist",
        "build",
        "__pycache__",
        ];

        const allowedExtensions = new Set([
        ".py", ".js", ".jsx", ".ts", ".tsx",
        ".java", ".cs", ".go", ".php", ".rb",
        ".sql", ".html", ".css",
        ]);

        const filteredFiles = selectedFiles.filter((file) => {
        const relativePath =
            file.webkitRelativePath || file.name;

        const parts = relativePath.split("/");
        const filename = parts[parts.length - 1];

        if (
            parts.some(
            (part) =>
                ignoredDirectories.includes(part) ||
                part.toLowerCase() === ".env" ||
                part.toLowerCase().startsWith(".env.")
            )
        ) {
            return false;
        }

        const lastDot = filename.lastIndexOf(".");
        const extension =
            lastDot >= 0
            ? filename.slice(lastDot).toLowerCase()
            : "";

        return allowedExtensions.has(extension);
        });

        setFiles(filteredFiles);
        setError("");

        // Permite volver a seleccionar la misma carpeta.
        event.target.value = "";
    };

    const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
    ) => {
    event.preventDefault();

    if (!owner.trim() || !url.trim()) {
        setError("Owner and URL are required.");
        return;
    }

    if (files.length === 0) {
        setError(
        "Select a folder containing supported source files."
        );
        return;
    }

    setIsSubmitting(true);
    setError("");

    try {
        const result = await registerProject(
        owner.trim(),
        url.trim(),
        files
        );

        setError(
        result.message || "Project registered successfully."
        );

        console.log("Backend response:", result);
    } catch (error) {
        setError(
        error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        );
    } finally {
        setIsSubmitting(false);
    }
    };


    const closeModal = () => {
        setError("");
        onClose();
    };

    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
            closeModal();
            }
        }}
        >
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-2xl sm:p-8"
        >
            <div className="flex items-start justify-between gap-4">
            <div>
                <h2
                id="register-title"
                className="text-2xl font-semibold"
                >
                Register a page
                </h2>

                <p className="mt-2 text-sm text-neutral-400">
                Add the project details and select its source folder.
                </p>
            </div>

            <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="rounded-md px-2 py-1 text-xl text-neutral-400 hover:bg-white/10 hover:text-white"
            >
                ×
            </button>
            </div>

            <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            >
            <div>
                <label
                htmlFor="owner"
                className="mb-2 block text-sm font-medium"
                >
                Owner
                </label>

                <input
                id="owner"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="Company or project owner"
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-white/40"
                required
                />
            </div>

            <div>
                <label
                htmlFor="url"
                className="mb-2 block text-sm font-medium"
                >
                URL
                </label>

                <input
                id="url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-white/40"
                required
                />
            </div>

            <div>
                <span className="mb-2 block text-sm font-medium">
                Source code
                </span>

                <DirectoryInput
                ref={folderInputRef}
                type="file"
                multiple
                accept=".py,.js,.jsx,.ts,.tsx,.java,.cs,.go,.php,.rb,.sql,.html,.css"
                onChange={handleFilesChange}
                className="hidden"
                aria-label="Choose source folder"
                webkitdirectory=""
                directory=""
                />

                <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="flex w-full flex-col items-center rounded-xl border border-dashed border-white/20 bg-black px-5 py-8 text-center transition-colors hover:border-white/50 hover:bg-white/[0.03]"
                >
                <span
                    className="mb-3 text-3xl"
                    aria-hidden="true"
                >
                    ↥
                </span>

                <span className="font-medium">
                    {files.length > 0
                    ? "Choose another folder"
                    : "Upload a folder"}
                </span>

                <span className="mt-2 text-xs text-neutral-500">
                    Python, JavaScript, TypeScript, Java and more
                </span>
                </button>

                {files.length > 0 && (
                <p className="mt-3 text-sm text-neutral-400">
                    {files.length} supported files selected
                </p>
                )}
            </div>

            {error && (
                <p
                role="status"
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-neutral-300"
                >
                {error}
                </p>
            )}

            <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-4 py-3 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                    {isSubmitting ? "Registering..." : "Register page"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }
