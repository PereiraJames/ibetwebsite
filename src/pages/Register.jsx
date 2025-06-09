import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Register.css";
import AuthLogin from "../components/GoogleLogin";

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
    const { name, value } = e.target;
  
    let newValue = value;
  
    // Prevent spaces in username
    if (name === "username") {
      newValue = newValue.replace(/\s/g, "");
    }
  
    setValues({
      ...values,
      [name]: newValue,
    });
  
    // Optionally clear field error as the user types
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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
      <div className="register-form-local">
        <AuthLogin/>
        <div className="register-or-local">
          <p>or</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group-local">
            <input
              type="text"
              placeholder={fieldErrors.username ? fieldErrors.username : "Username"}
              name="username"
              value={values.username}
              onChange={handleChanges}
              className={fieldErrors.username ? "input-error-register" : ""}
            />
            {fieldErrors.username && (
              <div className="input-error-message">{fieldErrors.username}</div>
            )}
          </div>


          <div className="input-group-local">
            {/* <label htmlFor="realname">Real Name</label> */}
            <input
              type="text"
              placeholder={
                fieldErrors.realname
                  ? fieldErrors.realname
                  : "Real Name"
              }
              name="realname"
              value={values.realname}
              onChange={handleChanges}
              className={fieldErrors.realname ? "input-error-register" : ""}
           />
           {fieldErrors.password && (
              <div className="input-error-message">{fieldErrors.realname}</div>
            )}
          </div>

          <div className="input-group-local">
            {/* <label htmlFor="phonenumber">Phone Number</label> */}
            <input
              type="text"
              placeholder={
                fieldErrors.phonenumber
                  ? fieldErrors.phonenumber
                  : "Phone Number"
              }
              name="phonenumber"
              value={values.phonenumber}
              onChange={handleChanges}
              className={fieldErrors.phonenumber ? "input-error-register" : ""}
           />
          {fieldErrors.phonenumber && (
              <div className="input-error-message">{fieldErrors.phonenumber}</div>
            )}
          </div>

          <div className="input-group-local">
            {/* <label htmlFor="phonenumber">Email</label> */}
            <input
              type="text"
              placeholder={
                fieldErrors.email
                  ? fieldErrors.email
                  : "Email"
              }
              name="email"
              value={values.email}
              onChange={handleChanges}
              className={fieldErrors.email ? "input-error-register" : ""}
           />
           {fieldErrors.email && (
              <div className="input-error-message">{fieldErrors.email}</div>
            )}
          </div>

          <div className="input-group-local">
            {/* <label htmlFor="password">Password</label> */}
            <input
              type="password"
              placeholder={
                fieldErrors.password
                  ? fieldErrors.password
                  : "Password"
              }
              name="password"
              value={values.password}
              onChange={handleChanges}
              className={fieldErrors.password ? "input-error-register" : ""}
           />
           {fieldErrors.password && (
              <div className="input-error-message">{fieldErrors.password}</div>
            )}
          </div>

          <div className="input-group-local">
            {/* <label htmlFor="confirmPassword">Confirm Password</label> */}
            <input
              type="password"
              placeholder={
                fieldErrors.confirmPassword
                  ? fieldErrors.confirmPassword
                  : "Confirm Password"
              }
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChanges}
              className={fieldErrors.confirmPassword ? "input-error-register" : ""}
           />
           {fieldErrors.confirmPassword && (
              <div className="input-error-message">{fieldErrors.confirmPassword}</div>
            )}
          </div>

          <button className="register-confirm-button-local">Register!</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="">
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
