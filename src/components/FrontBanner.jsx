import "../css/FrontPageBanner.css";
import CountdownTimer from "./CountdownTimer";

function FrontPageBanner() {
  return (
    <div className="front-img-container">
  <img 
    src="/images/web/front-banner.jpg" 
    className="front-banner" 
    alt="Front Banner"
  />
  <div className="front-img-text">
    <h5>JAMES PEREIRA PRESENTS</h5>
    <h1>I BET MARK AND MAJELLA</h1>
    <p>Don’t Just Watch Them Grow, Watch Your Bets Grow Too!</p>
    <CountdownTimer />
  </div>
</div>

  );
}

export default FrontPageBanner;
