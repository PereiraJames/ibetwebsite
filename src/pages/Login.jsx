import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import AuthLogin from "../components/GoogleLogin";
import TelegramRedirector from "../components/TelegramRedirect";


function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ENDPOINT_URL}/auth/account-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
      console.error("Error:", error);
      setErrorMessage("Error occurred while submitting the user.");
    }
  };

  return (
    <div className="login-container">
      <div className="navbar-space"></div>
      <TelegramRedirector/>

      <div className="login-form-local">
        <AuthLogin/>
        <div className="login-or-local">
          <p>or</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group-local">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChanges}
            />
          </div>
          <div className="input-group-local">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChanges}
            />
          </div>
          <button type="submit">Submit!</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div>
          <p>No Account?</p>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <img
        src="/images/web/login.jpg"
        alt="login-img"
        className="login-img"
      />
    </div>
  
  );
}

export default Login;
