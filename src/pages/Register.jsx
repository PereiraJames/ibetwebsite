import "../css/BestBets.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  // Define the initial state values for all form fields
  const [values, setValues] = useState({
    username: "",
    realname: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle changes for all input fields
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the password and confirm password match
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.52:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        console.log(response.status);
        console.log(response);
        // Handle the error or show a message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while submitting the user.");
    }
  };

  return (
    <div>
      <div>
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
          </div>

          <div>
            <label htmlFor="phoneNo">Phone No.</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              name="phoneNo"
              value={values.phoneNo}
              onChange={handleChanges}
            />
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
          </div>
          <button>Submit!</button>
        </form>
        <div>
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
