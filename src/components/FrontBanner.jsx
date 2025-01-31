import "../css/Home.css";

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
        <h1>I BET MARK AND MAJELLA</h1>
        <h2>Their gate way to financial freedom</h2>
        <div>Think of their children! Make a Bet!</div>
      </div>
    </div>
  );
}

export default FrontPageBanner;
