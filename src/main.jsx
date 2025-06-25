import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLEAUTHTOKEN = import.meta.env.VITE_GOOGLEAUTH_TOKEN;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLEAUTHTOKEN}>
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
