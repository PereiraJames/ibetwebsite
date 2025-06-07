import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../css/Register.css";

function GoogleRegister() {
  const location = useLocation();
  const googlecredentials = location.state?.googlecredentials;

  if (!googlecredentials) {
    return (
      <div className="register-container">
        <div className="navbar-space"></div>
        <div className="register-form">
          <h2>Google registration unavailable</h2>
          <p>Please try logging in again through Google.</p>
          <a href="/">Back to Home</a>
        </div>
      </div>
    );
  }

  const [values, setValues] = useState({
    realname: googlecredentials?.name || "",
    
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const errors = {};

    if (!values.username) errors.username = "Username is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const registerdata = {
        "username": values.username,
        "name" : googlecredentials.name,
        "email": googlecredentials.email,
        "firstName": googlecredentials.firstName,
        "lastName": googlecredentials.lastName,
        "emailVerified": googlecredentials.emailVerified,
        "registeredMethod": "google",
      }

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
      } else if (response.status === 408){
        errors.username = "Email is already Registered";
        setFieldErrors(errors);
      }
      else if (response.status === 409){
        errors.username = "Username is required";
        setFieldErrors(errors);
      }
      else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error occurred while submitting the user.");
    }
  };

  return (
    <div className="register-container">
      <div className="navbar-space"></div>
      <div className="register-form">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={values.username}
              onChange={handleChanges}
            />
            {fieldErrors.username && (
              <p className="error-message">{fieldErrors.username}</p>
            )}
          </div>

          <p>{googlecredentials?.email || ""}</p>
          
          <button>Register!</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div>
          <p>Already have an account?</p>
          <a href="/login">Login</a>
        </div>
      </div>
      <img
        id="register-img"
        src="/images/web/register.jpg"
        alt="register-img"
        className="register-img"
      />
    </div>
  );
}

export default GoogleRegister;
