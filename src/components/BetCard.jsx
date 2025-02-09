import { useState, useEffect } from "react";
import "../css/BetCard.css";
import AcceptBetButton from "./AcceptBetButton";

function BetCard({ bet: initialBet }) {
  const [bet, setBet] = useState(initialBet); // Track bet state
  const [likes, setLikes] = useState(initialBet.likes);

  useEffect(() => {
    setBet(initialBet);
    setLikes(initialBet.likes);
  }, [initialBet]);

  async function onLike() {
    try {
      const response = await fetch("http://192.168.1.52:3000/api/bets/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betId: bet.id }),
      });

      if (response.ok) {
        setLikes((prevLikes) => prevLikes + 1);
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
        <p>Bet Accepted By: {bet.acceptor || "-"}</p>
        <p>Wager: ${bet.betamount}</p>
        <p>Start Date: {bet.startdate}</p>
        <p>Due Date: {bet.enddate}</p>
        <p>Conditionals: {bet.conditionals}</p>
      </div>
      <div className="interaction-bar">
        <button
          className={`favorite-btn ${likes > initialBet.likes ? "active" : ""}`}
          onClick={onLike}
        >
          ♥ {likes}
        </button>

        {!bet.isAccepted ? (
          <AcceptBetButton bet={bet} onBetAccepted={setBet} />
        ) : (
          <div>You Have Accepted This Bet</div>
        )}
      </div>
    </div>
  );
}

export default BetCard;
