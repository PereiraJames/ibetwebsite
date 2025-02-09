import "../css/AcceptBetButton.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AcceptBetButton({ bet, onBetAccepted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const JWTtoken = localStorage.getItem("token");

  const togglePopup = () => setIsOpen(!isOpen);

  const handleBetAccept = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.1.52:3000/bet/accept-bet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTtoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betID: bet.id }),
      });

      if (response.status === 200) {
        const updatedBet = { ...bet, isAccepted: true, acceptor: "You" }; // Update local state
        onBetAccepted(updatedBet); // Notify parent component (BetCard)
      } else {
        console.log("Error accepting bet");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    togglePopup();
  };

  return (
    <div>
      <button className="accept-button" onClick={togglePopup}>
        Accept Bet!
      </button>

      {isOpen && JWTtoken && (
        <div className="accept-popup">
          <div className="accept-popup-content">
            <p>Are you sure you want to accept the bet?</p>
            <button className="confirm-button" onClick={handleBetAccept}>
              Yes
            </button>
            <button className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      {isOpen && !JWTtoken && (
        <div className="accept-popup">
          <div className="accept-popup-content">
            <p>Please log in to accept the bet.</p>
            <Link to="/login">
              <button>Go to Login</button>
            </Link>
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
