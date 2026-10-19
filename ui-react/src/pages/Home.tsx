import { useState } from "react";

import WelcomeSection from "../components/WelcomeSection"
import AddPageCard from "../components/AddPageCard";
import RegisterPageModal from "../components/RegisterPageModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10">

      {/* Left: welcome content */}
      <WelcomeSection />

      {/* Right: add page card */}
      <AddPageCard
        onAddPage={() => setIsModalOpen(true)}
      />

      {/* Registration modal */}
      {isModalOpen && (
        <RegisterPageModal
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
