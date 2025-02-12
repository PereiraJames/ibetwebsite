import "../css/FrontPageBanner.css";

function FrontPageBanner() {
  return (
    <div className="front-img-container">
      <img
        src="src/css/images/mobile/front-page-img.jpg"
        srcSet="src/css/images/web/front-page-img.png 768w"
        sizes="(max-width: 768px) 100vw, 50vw"
        alt="front-page-img"
      />
      <div className="front-img-text">
        <h5>JAMES PEREIRA PRESENTS</h5>
        <h1>I BET MARK AND MAJELLA</h1>
        <p>Place Your Bets—Because Kids Need Financial Freedom Too!</p>
        <p>Don’t Just Watch Their Kids Grow, Watch Your Bets Grow Too!</p>
      </div>
    </div>
  );
}

export default FrontPageBanner;
