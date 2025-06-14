import { BrowserRouter } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { ServiceProvider } from "./context/index.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ServiceProvider>
      <App />
    </ServiceProvider>
  </BrowserRouter>
);
