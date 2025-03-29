import "../css/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthLogin() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);

      const registerdata = {
        "name": decoded.name,
        "email": decoded.email,
        "firstName": decoded.given_name,
        "lastName": decoded.family_name,
        "emailVerified": decoded.email_verified,
        "registeredMethod": "google"
      }

      // Sending the Google credentials to your API
      const response = await fetch(`${ENDPOINT_URL}/auth/google-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerdata),
      });

      if (response.status === 201) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/");
      } else if (response.status === 409){ 
        console.log("alr exists")
        handleGoogleLogin(credentialResponse);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Error occurred while logging in with Google.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      console.log(decoded); // You can check what data you get here

      const logindata = {
        "name": decoded.name,
        "email": decoded.email,
        "firstName": decoded.given_name,
        "lastName": decoded.family_name,
        "emailVerified": decoded.email_verified,
        "registeredMethod": "google"
      }

      // Sending the Google credentials to your API
      const response = await fetch(`${ENDPOINT_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Error occurred while logging in with Google.");
    }
  };

  

  return (
    <div className="userprofile-container">
      <div className="navbar-void"></div>
      <div className="bestbets-empty">
        <GoogleLogin
          onSuccess={handleGoogleRegister}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log("Login Failed");
          }}
        /> */}
      </div>
    </div>
  );
}

export default AuthLogin;
