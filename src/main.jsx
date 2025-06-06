import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="430525821149-6nngo29pne32rjoht9fotrvd4bi3jmg3.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
