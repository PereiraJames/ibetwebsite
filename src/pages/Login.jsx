import "../css/BestBets.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.52:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status == 200) {
        //Add this to client side Local Storage. basically caches the token for them.
        const data = await response.json();
        localStorage.setItem("token", data.token);

        //Sends the client to the home page.
        navigate("/");
      } else {
        console.log(response.status);
        console.log(await response.json());
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
              onChange={handleChanges}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChanges}
            />
          </div>
          <button>Submit!</button>
        </form>
        <div>
          <p>No Account?</p>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
