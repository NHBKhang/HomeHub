import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import "./styles/global.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>
);
