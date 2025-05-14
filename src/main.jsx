import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GlobalProvider } from "./context/GlobalState.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </StrictMode>
);
