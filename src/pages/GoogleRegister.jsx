import "../css/Login.css";
import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthLogin() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const isInAppBrowser = () => {
    const ua = navigator.userAgent;
    return /Instagram|FBAV|FBAN|Messenger|Line|Telegram/i.test(ua);
  };

  useEffect(() => {
    if (isInAppBrowser()) {
      window.location.href = "/open-in-browser";
    }
  }, []);

  const login = useGoogleLogin({
    flow: 'auth-code',
    code_challenge_method: 'S256',
    onSuccess: async (response) => {
      console.log("test")
      try {
        const serverResponse = await fetch(`${ENDPOINT_URL}/auth/google-auth-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: response.code,
            redirect_uri: window.location.origin + "/auth/callback"
          }),
        });
  
        if (serverResponse.ok) {
          const data = await serverResponse.json();
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          const errorData = await serverResponse.json();
          setErrorMessage(errorData.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Something went wrong during login.");
      }
    },
    onError: () => setErrorMessage("Google login failed"),
    redirect_uri: window.location.origin + "/auth/callback"
  });

  return (
    <div>
      <div className="google-login-wrapper">
        <button onClick={() => login()}>Sign in with Google</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default AuthLogin;
