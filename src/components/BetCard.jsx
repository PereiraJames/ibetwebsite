import "../css/BetCard.css";

function BetCard({ bet }) {
  function onLike() {
    alert("Added to favorites");
  }

  return (
    <div className="bet-card">
      <div className="bet-info">
        <h3>{bet.text}</h3>
        <p>Bet Placed By: {bet.bettor}</p>
        <p>Wager: ${bet.betamount}</p>
        <p>Start Date: {bet.startdate}</p>
        <p>Due Date: {bet.enddate}</p>
        <p>Conditionals: {bet.conditionals}</p>
      </div>
      <button className="favorite-btn" onClick={onLike}>
        ♥
      </button>
    </div>
  );
}

export default BetCard;
