
import { Routes, Route } from "react-router-dom";

import TopBar from "./components/TopBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Analysis from "./pages/Analysis";
import View from "./pages/View";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopBar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/analysis/projects/:projectId"
            element={<View />}
          />
        </Routes>
      </main>
    </div>
  );
}
