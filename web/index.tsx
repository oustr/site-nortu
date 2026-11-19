import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage/HomePage.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <div className="min-h-screen bg-white text-black">
    <HomePage />
  </div>,
);
