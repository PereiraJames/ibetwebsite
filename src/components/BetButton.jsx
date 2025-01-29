import { useState } from "react";
import "../css/BetButton.css"; // Optional: For styling

function BetButton() {
  const date = new Date();

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

  const togglePopup = () => setIsOpen(!isOpen);

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

    console.log(JWTtoken);

    const response = await fetch("http://192.168.1.52:3000/auth/get-username", {
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
    return data.username;
  };

  // Submit the bet details to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format endDate before sending it to the backend
    const formattedEndDate = formatDate(betDetails.endDate);
    const bettorFromToken = await fetchUserName();

    // Update betDetails with the formatted endDate
    const updatedBetDetails = {
      ...betDetails,
      endDate: formattedEndDate,
      bettor: bettorFromToken,
    };

    try {
      const response = await fetch("http://192.168.1.52:3000/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBetDetails),
      });

      if (response.ok) {
        alert("Bet created successfully!");
        setBetDetails({
          text: "",
          betAmount: "",
          endDate: "",
          bettor: "",
          conditionals: "",
          phoneNo: "",
        });
        setIsOpen(false); // Close popup after submit
      } else {
        alert(`Failed to create bet. ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while submitting the bet.");
    }
  };

  return (
    <div>
      {/* Bet Button */}
      <button className="bet-button" onClick={togglePopup}>
        Create Bet
      </button>

      {/* Popup Form */}
      {isOpen && (
        <div className="bet-popup">
          <div className="bet-popup-content">
            <h2>Create a New Bet</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Bet Text</label>
                <input
                  type="text"
                  name="text"
                  value={betDetails.text}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bet Amount</label>
                <input
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
                <label>Conditionals</label>
                <input
                  type="text"
                  name="conditionals"
                  value={betDetails.conditionals}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={betDetails.phoneNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
            <button className="close-button" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BetButton;
