import "../css/HowToPlay.css";
import BetCard from "../components/BetCard";

function HowToPlay() {
  const bet = {
    text: "asd",
    username: "james",
    betamount: "24",
    enddate: "as",
    conditionals: "asd",
  };

  return (
    <div className="htp-container">
      <div className="navbar-void"></div>
      <div className="htp-content">
        <div className="htp-text-content">
          <h1>How To Play</h1>

          <section>
            <h2>Game Concept</h2>
            <p>
              Welcome to the game where you bet on life’s most unpredictable outcomes — like Mark and Majella’s wedding. Will they have kids? How many? Will they make it through a full year without moving to Bali to "find themselves"?
              You create a bet, someone else takes the other side, and time does the rest.
            </p>
          </section>

          <section>
            <h2>Placing a Bet</h2>
            <ul>
              <li><strong>Create a Bet:</strong> Write something bold, funny, or wildly speculative. Add the amount, the dates, and any fine print.</li>
              <li><strong>Someone Accepts:</strong> If someone disagrees (or just wants to stir drama), they accept the bet.</li>
              <li><strong>Wait:</strong> Time passes. Lives unfold. Drama happens. You watch from the sidelines with popcorn.</li>
              <li><strong>Settle the Bet:</strong> When the end date comes, players decide the winner based on reality and settle payments respectively.</li>
            </ul>
          </section>

          <section>
            <h2>Payments & Responsibility</h2>
            <p>
            You enter the amount on the bet card, but when it’s time to settle, it’s your responsibility to track down the person who owes you. Whether it’s a polite reminder, a stern look, or the time-honored Singaporean “spray paint on the wall” approach, the choice is yours.
            </p>
          </section>

          <section>
            <h2>What About Conditionals?</h2>
            <p>
              Conditionals are optional extra notes for your bet — like "only counts if they’re still married" or "twins count as two." They’re there if you want to cover your bases or avoid future debates.
            </p>
          </section>

          <section>
            <h2>Liking Bets</h2>
            <p>
              Not ready to risk your cash but want to show some love (or just keep up appearances)? Hit the like button on any bet. It’s a zero-risk way to show support or appreciation without actually participating.
            </p>
          </section>

          <section>
            <h2>Golden Rule</h2>
            <p>
              Make all the terrible bets you can. The worse, the better. If it’s dumb enough to cause a fight, you’re doing it right.
            </p>
          </section>
        </div>

        <div className="card-back-example">
          <div className="bet-card-example"></div>
        </div>

      </div>
    </div>
  );
}

export default HowToPlay;
