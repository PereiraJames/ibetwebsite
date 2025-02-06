import "../css/Carousell.css";

function Carousell() {
  const phrases = [
    "Breaking News: New event released!",
    "Don't miss out on the latest update!",
    "Join us for an exciting adventure.",
    "The new feature is now live!",
    "Get ready for the upcoming challenge!",
  ];

  return (
    <div className="carousell-container">
      <div className="carousell-item-container">
        {phrases.map((phrase, index) => (
          <div className="carousell-item" key={index}>
            {phrase}
          </div>
        ))}
        {/* Duplicate the phrases to create the seamless loop */}
        {phrases.map((phrase, index) => (
          <div className="carousell-item" key={`repeat-${index}`}>
            {phrase}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousell;
