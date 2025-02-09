import { useState, useEffect } from "react";
import "../css/BetCard.css";
import AcceptBetButton from "./AcceptBetButton";

function BetCard({ bet }) {
  const [likes, setLikes] = useState(bet.likes); // Track likes in state

  useEffect(() => {
    setLikes(bet.likes); // Update likes when bet changes
  }, [bet]);

  async function onLike() {
    try {
      const response = await fetch("http://192.168.1.52:3000/api/bets/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betId: bet.id }),
      });

      if (response.ok) {
        setLikes((prevLikes) => prevLikes + 1); // Update UI after successful response
      } else {
        console.error("Failed to like bet");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="bet-card">
      <div className="bet-info">
        <h3>{bet.text}</h3>
        <p>Bet Placed By: {bet.bettor}</p>
        <p>Bet Accepted By: - {bet.acceptor}</p>
        <p>Wager: ${bet.betamount}</p>
        <p>Start Date: {bet.startdate}</p>
        <p>Due Date: {bet.enddate}</p>
        <p>Conditionals: {bet.conditionals}</p>
        {/* <p>Likes: {likes}</p> Display updated like count */}
      </div>
      <div className="interaction-bar">
        <button
          className={`favorite-btn ${likes > bet.likes ? "active" : ""}`}
          onClick={onLike}
        >
          ♥ {likes}
        </button>
        <AcceptBetButton />
      </div>
    </div>
  );
}

export default BetCard;
