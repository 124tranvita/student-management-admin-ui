import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Providers from "./providers.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
  // </React.StrictMode>
);
