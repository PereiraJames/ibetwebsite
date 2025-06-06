import { useState, useEffect } from "react";
import "../css/BetCard.css";
import AcceptBetButton from "./AcceptBetButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


function BetCard({ bet: initialBet }) {
  const [bet, setBet] = useState(initialBet); // Track bet state
  const [likes, setLikes] = useState(initialBet.likes_count);
  const [isLiked, setIsLiked] = useState(initialBet.isLiked);
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;
  const JWTtoken = localStorage.getItem("token");

  useEffect(() => {
    setBet(initialBet);
    setLikes(initialBet.likes_count);

    setIsLiked(initialBet.isLiked);
  }, [initialBet]);

  async function onLike() {
    const JWTtoken = localStorage.getItem("token");

    if (JWTtoken) {
      console.log("clicked")
      try {
        const response = await fetch(`${ENDPOINT_URL}/user/bet-like`, {
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
    } else {
      console.log("Liking Requires You To Be Logged-In");
    }
  }

  return (
    <div className="bet-card">
      <div className="bet-info">
        <h3 className="text-resize">{bet.text}</h3>
        <p className="text-resize">
          Bet Placed By: {bet.username.toUpperCase()}
        </p>
        {/* <p className="text-resize">Bet Accepted By: {bet.acceptor || "-"}</p> */}
        <p className="text-resize">Wager: ${bet.betamount}</p>
        <p className="text-resize">Start Date: {bet.startdate}</p>
        <p className="text-resize">Due Date: {bet.enddate}</p>
        <p className="text-resize">Conditionals: {bet.conditionals}</p>
      </div>
      <div className="interaction-bar">
      <button
        className={`favorite-btn ${isLiked ? "active" : ""}`}
        onClick={onLike}
      >
        <FontAwesomeIcon icon={faHeart} className={`heart-icon ${isLiked ? "liked" : ""}`} />
        <span className="like-count">{likes}</span>
      </button>


      {!bet.isAccepted ? (
          <AcceptBetButton bet={bet} onBetAccepted={setBet} />
        ) : (
          <div>Accepted</div>
        )}
        
      </div>
      {/* <LoginPopUp /> */}
    </div>
  );
}

export default BetCard;
