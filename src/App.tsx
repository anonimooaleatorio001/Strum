import { useState } from "react";
import { ProgressProvider } from "./state/progress";
import Hero from "./components/Hero";
import Toolkit from "./components/Toolkit";
import Footer from "./components/Footer";
import type { ToolId } from "./tools/tools";

export default function App() {
  const [tool, setTool] = useState<ToolId>("learn");

  const goToTool = (t: ToolId) => {
    setTool(t);
    requestAnimationFrame(() =>
      document.getElementById("toolkit")?.scrollIntoView({ behavior: "smooth" })
    );
  };

  return (
    <ProgressProvider>
      <Hero onNavigate={goToTool} />
      <Toolkit active={tool} setActive={setTool} />
      <Footer onNavigate={goToTool} />
    </ProgressProvider>
  );
}
