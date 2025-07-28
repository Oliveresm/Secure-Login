import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
        <App />
        <Toaster
          richColors // nicer color palette
          position="bottom-right" // pick any position
          theme="dark" // light | dark | system
          duration={4000} // default auto-close
        />
    </BrowserRouter>
  </StrictMode>
);
