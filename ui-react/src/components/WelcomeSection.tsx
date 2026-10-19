
export default function WelcomeSection() {
    return (
        <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
                Security analysis platform
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
                Understand your security.
                <span className="mt-2 block text-neutral-500">
                Find what matters.
                </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-400 md:text-lg">
                Analyze applications, explore security findings,
                and manage your analysis from one place.
            </p>
        </div>
    );
}
