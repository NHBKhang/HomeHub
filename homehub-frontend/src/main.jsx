import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
