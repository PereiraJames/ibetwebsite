import { useState } from "react";
import "../css/BetButton.css";
import { isJWTValid } from "../services/utils";
import { Link, useNavigate } from "react-router-dom";

function BetButton() {
  const date = new Date();
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;
  const navigate = useNavigate();

  const formatteddate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const [isOpen, setIsOpen] = useState(false); // Track popup state
  const [betDetails, setBetDetails] = useState({
    text: "",
    betAmount: "",
    endDate: "",
    bettor: "",
    conditionals: "",
    phoneNo: "",
    startDate: formatteddate,
  });
  const [errorMessage, setErrorMessage] = useState(""); // Track error message
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const JWTtoken = localStorage.getItem("token");

  if (!isJWTValid(JWTtoken) && JWTtoken) {
    localStorage.removeItem('token');
    console.log('Invalid or expired token removed.');
  }

  const checkTokenValidity = () => {
    if (!JWTtoken) return false;
    const decodedToken = parseJwt(JWTtoken);
    return decodedToken && decodedToken.exp > Math.floor(Date.now() / 1000);
  };

  const toggleLoginPopup = () => {
    
    setIsLoginOpen(!isLoginOpen);
    setErrorLoginMessage(""); // Reset error message
    setIsTokenValid(checkTokenValidity()); 
    // console.log("login popup");
    // console.log(`Login ${isLoginOpen} Bet ${isOpen}`);// Check token validity when opening
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
    // console.log("bet popup");
    // console.log(`Login ${isLoginOpen} Bet ${isOpen}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBetDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to format date (yyyy-mm-dd) to dd-mmm-yyyy
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day}-${months[parseInt(month) - 1]}-${year}`;
  };

  const fetchUserName = async () => {
    const JWTtoken = localStorage.getItem("token");

    if (!isJWTValid(JWTtoken) && JWTtoken) {
        localStorage.removeItem('token');
        console.log('Invalid or expired token removed.');
      }

    const response = await fetch(`${ENDPOINT_URL}/auth/get-username`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JWTtoken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();

    return data.userData;
  };

  // Submit the bet details to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent further submissions if already loading
    if (isLoading) return;

    setIsLoading(true); // Set loading to true when submission starts

    const prefixBet = `I bet Mark and Majella will ${betDetails.text}`;
    const formattedEndDate = formatDate(betDetails.endDate);
    const JWTtoken = localStorage.getItem("token");

    if (!isJWTValid(JWTtoken) && JWTtoken) {
      localStorage.removeItem('token');
      console.log('Invalid or expired token removed.');
    }

    // Update betDetails with the formatted endDate
    const updatedBetDetails = {
      ...betDetails,
      endDate: formattedEndDate,
      text: prefixBet,
    };

    try {
      const response = await fetch(`${ENDPOINT_URL}/bet/create-bet`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTtoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBetDetails),
      });

      if (response.ok) {
        console.log("Bet Successfully Created!");
        setBetDetails({
          text: "",
          betAmount: "",
          endDate: "",
          conditionals: "",
        });
        setIsOpen(false);
        window.location.reload();
        setErrorMessage(""); // Clear error message on success
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create bet.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error occurred while submitting the bet.");
    } finally {
      setIsLoading(false); // Set loading to false once the process completes
    }
  };

  return (
    <div>
      {/* Bet Button */}
      <button
  className="bet-button"
  onClick={() => {
    if (JWTtoken) {
      togglePopup();
    } else {
      toggleLoginPopup();
    }
  }}
>
  BET!
</button>
  
      {/* BET POPUP - User is logged in and clicked BET */}
      {isOpen && !isLoginOpen && JWTtoken && (
        <div className="bet-popup">
          <div className="bet-popup-content">
            <h2 className="bet-popup-title">Create a New Bet</h2>
  
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="bet-text-group">
                  <span className="bet-text-prefix">
                    I bet Mark and Majella will...
                  </span>
                  <input
                    placeholder="have 2 boys and a girl"
                    type="text"
                    name="text"
                    value={betDetails.text}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
  
              <div className="form-group">
                <label>Bet Amount</label>
                <input
                  placeholder="$10"
                  type="text"
                  name="betAmount"
                  value={betDetails.betAmount}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={betDetails.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div className="form-group">
                <label>Conditionals (Optional)</label>
                <input
                  placeholder="If one is gay, then cancel the bet"
                  type="text"
                  name="conditionals"
                  value={betDetails.conditionals}
                  onChange={handleChange}
                />
              </div>
  
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
  
            <button className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
  
      {/* LOGIN POPUP - User clicked BET but is not logged in */}
      {!isOpen && isLoginOpen && !JWTtoken && (
        <div className="accept-popup">
          <div className="accept-popup-content">
            {isTokenValid ? (
              <>
                <p className="accept-popup-text">
                  Are you sure you want to accept the bet?
                </p>
                <p className="accept-popup-text">{betDetails.text}</p>
                {errorLoginMessage && (
                  <p className="error-message">{errorLoginMessage}</p>
                )}
                <button className="accept-confirmation-button" onClick={handleBetAccept}>
                  Accept
                </button>
                <button className="accept-close-button" onClick={toggleLoginPopup}>
                  Close
                </button>
              </>
            ) : (
              <>
                <p className="popup-login-text">Please log in or register to create a bet.</p>
                <Link to="/login" onClick={toggleLoginPopup}>
                  <button className="popup-login">Go to Login</button>
                </Link>
                <button className="close-button" onClick={toggleLoginPopup}>
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

export default BetButton;
