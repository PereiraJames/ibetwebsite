import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Register.css";

function Register() {
  const [values, setValues] = useState({
    username: "",
    realname: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    email: "",
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
    if (!values.realname) errors.realname = "Real name is required";
    if (!values.password) errors.password = "Password is required";
    if (!values.phonenumber) errors.phonenumber = "Phone Number is required";
    if (!values.email) errors.email = "Phone Number is required";

    if (!/^[89]\d{7}$/.test(values.phonenumber)) {
      errors.phonenumber = "Enter a valid 8-digit phone number";
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.email)) {
      errors.email = "Enter a valid email address";
    }    
    
    if (!values.confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${ENDPOINT_URL}/auth/account-register`, {
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
    <div className="register-container">
      <div className="navbar-space"></div>
      <div className="register-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              value={values.username}
              onChange={handleChanges}
            />
            {fieldErrors.username && (
              <p className="error-message">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="realname">Real Name</label>
            <input
              type="text"
              placeholder="Enter Real Name"
              name="realname"
              value={values.realname}
              onChange={handleChanges}
            />
            {fieldErrors.realname && (
              <p className="error-message">{fieldErrors.realname}</p>
            )}
          </div>

          <div>
            <label htmlFor="phonenumber">Phone Number</label>
            <input
              type="text"
              placeholder="Enter Phone No."
              name="phonenumber"
              value={values.phonenumber}
              onChange={handleChanges}
            />
            {fieldErrors.phonenumber && (
              <p className="error-message">{fieldErrors.phonenumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="phonenumber">Email</label>
            <input
              type="text"
              placeholder="Enter Valid Email"
              name="email"
              value={values.email}
              onChange={handleChanges}
            />
            {fieldErrors.email && (
              <p className="error-message">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={values.password}
              onChange={handleChanges}
            />
            {fieldErrors.password && (
              <p className="error-message">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChanges}
            />
            {fieldErrors.confirmPassword && (
              <p className="error-message">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button>Submit!</button>
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

export default Register;
