import "../css/AcceptBetButton.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isJWTValid } from "../services/utils";

function AcceptBetButton({ bet, onBetAccepted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const JWTtoken = localStorage.getItem("token");

  if (!isJWTValid(JWTtoken) && JWTtoken) {
    localStorage.removeItem('token');
    console.log('Invalid or expired token removed.');
  }

  const parseJwt = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (e) {
      return null;
    }
  };

  const checkTokenValidity = () => {
    if (!JWTtoken) return false;
    const decodedToken = parseJwt(JWTtoken);
    return decodedToken && decodedToken.exp > Math.floor(Date.now() / 1000);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setErrorMessage(""); // Reset error message
    setIsTokenValid(checkTokenValidity()); // Check token validity when opening
  };

  const handleBetAccept = async (e) => {
    e.preventDefault();

    if (!isTokenValid) {
      setErrorMessage("Your session has expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${ENDPOINT_URL}/bet/accept-bet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTtoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betID: bet.bet_id }),
      });

      if (response.ok) {
        const updatedBet = { ...bet, isAccepted: true, acceptor: "You" };
        onBetAccepted(updatedBet); // Notify parent component
        togglePopup();
      } else {
        setErrorMessage("Failed to accept the bet. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while accepting the bet.");
    }
  };

  return (
    <div>
      <button className="accept-button" onClick={togglePopup}>
        ACCEPT BET!
      </button>

      {isOpen && (
        <div className="accept-popup">
          <div className="accept-popup-content">
            {isTokenValid ? (
              <>
                <p className="accept-popup-text">
                  Are you sure you want to accept the bet?
                </p>
                <p className="accept-popup-text">{bet.text}</p>
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                <button className="accept-confirmation-button" onClick={handleBetAccept}>
                  Accept
                </button>
                <button className="accept-close-button" onClick={togglePopup}>
                  Close
                </button>
              </>
            ) : (
              <>
                <p>Please log in to accept the bet.</p>
                <Link to="/login">
                  <button className="popup-login">Go to Login</button>
                </Link>
                <button className="close-button" onClick={togglePopup}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AcceptBetButton;
