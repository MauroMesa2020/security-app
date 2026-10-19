
import cyberImage from "../assets/CybersecurityLogo.png";

type AddPageCardProps = {
    onAddPage: () => void;
};

export default function AddPageCard({
    onAddPage,
}: AddPageCardProps) {
    return (
        <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-950 p-6 transition-colors hover:border-white/20">
                <div className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                <img
                    src={cyberImage}
                    alt="Cybersecurity illustration"
                    className="h-full w-full object-cover"
                />
                </div>

                <h2 className="text-xl font-semibold">
                Add a page
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Register a website or source-code project to
                    start your security analysis.
                </p>

                <button
                    type="button"
                    onClick={onAddPage}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                <span aria-hidden="true">+</span>
                    Add page
                </button>
            </div>
        </div>
    );
}
