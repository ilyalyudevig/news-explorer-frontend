import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./components/App";
import CurrentUserContextWrapper from "./contexts/CurrentUserContextWrapper";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CurrentUserContextWrapper>
        <App />
      </CurrentUserContextWrapper>
    </BrowserRouter>
  </StrictMode>
);
