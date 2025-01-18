import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { Sidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

function App() {
  return (
    <div className="h-screen flex lg:flex-row flex-col bg-muted">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background border-l">
        <div className="border-b h-14">hi</div>
        <div className="flex-1 bg-muted"></div>
      </div>
    </div>
  );
}
