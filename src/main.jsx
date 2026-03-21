import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";
import "./index.css";
import App from "./App.jsx";

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.classList.add(savedTheme);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
