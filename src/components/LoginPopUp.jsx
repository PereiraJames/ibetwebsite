import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPopUp.css"; // Optional: For styling

function LoginPopUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const [isOpen, setIsOpen] = useState(false); // Track popup state

  const togglePopup = () => setIsOpen(!isOpen);

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Submit the bet details to the backend
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
        togglePopup();
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
    <div>
      {/* Bet Button */}
      <button className="bet-button" onClick={togglePopup}>
        Login/Register
      </button>

      {/* Popup Form */}
      {isOpen && (
        <div className="bet-popup">
          <div className="bet-popup-content">
            <h2>Login</h2>
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
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
              <p>No Account?</p>
              <Link to="/register">Register</Link>
            </div>
            <button className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPopUp;
