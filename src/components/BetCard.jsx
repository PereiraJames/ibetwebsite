import { useState, useEffect } from "react";
import "../css/BetCard.css";
import AcceptBetButton from "./AcceptBetButton";
import LoginPopUp from "./LoginPopUp";
import { faDatabase } from "@fortawesome/free-solid-svg-icons/faDatabase";

function BetCard({ bet: initialBet }) {
  const [bet, setBet] = useState(initialBet); // Track bet state
  const [likes, setLikes] = useState(initialBet.likes_count);
  const [isLiked, setIsLiked] = useState(initialBet.isLiked);

  useEffect(() => {
    setBet(initialBet);
    setLikes(initialBet.likes_count);
    setIsLiked(initialBet.isLiked);
  }, [initialBet]);

  async function onLike() {
    const JWTtoken = localStorage.getItem("token");
    try {
      const response = await fetch("http://192.168.1.52:3000/user/bet-like", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWTtoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ betId: bet.bet_id }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        if (data.liked) {
          setLikes((prevLikes) => prevLikes + 1);
          setIsLiked(true);
        } else {
          setLikes((prevLikes) => prevLikes - 1);
          setIsLiked(false);
        }
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
          className={`favorite-btn ${isLiked ? "active" : ""}`}
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
      {/* <LoginPopUp /> */}
    </div>
  );
}

export default BetCard;
