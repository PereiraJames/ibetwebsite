import "../css/AcceptBetButton.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AcceptBetButton() {
  const [isOpen, setIsOpen] = useState(false); // Track popup state

  const togglePopup = () => setIsOpen(!isOpen);

  const JWTtoken = localStorage.getItem("token");

  const [values, setValues] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [betAcceptValues, setBetAcceptValues] = useState({
    accept: "",
    password: "",
  });

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

  const handleBetAccept = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.52:3000/auth/login", {
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
    <div>
      <button className="accept-button" onClick={togglePopup}>
        Accept Bet!
      </button>

      {isOpen && !JWTtoken && (
        <div className="accept-popup">
          <div className="accept-popup-content">
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

      {isOpen && JWTtoken && (
        <div className="accept-popup">
          <div className="accept-popup-content">
            <p>Are you sure you want to accept the bet?</p>
            <button className="close-button" onClick={togglePopup}>
              Yes
            </button>
            <button className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptBetButton;
