import "../css/Carousell.css";

function Carousell() {
  const phrases = [
    "Mark the Date: 8th November 2025",
    "Countdown: 0",
    "Join us for an exciting adventure.",
    "The new feature is now live!",
    "Get ready for the upcoming challenge!",
  ];

  return (
    <div className="carousell-item-container">
      <div className="carousell-item item1"></div>
      <div className="carousell-item item2"></div>
      <div className="carousell-item item3"></div>
      <div className="carousell-item item4"></div>
      <div className="carousell-item item5"></div>
      <div className="carousell-item item6"></div>
      <div className="carousell-item item7"></div>
      <div className="carousell-item item8"></div>
    </div>
  );
}

export default Carousell;
