import { Link } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">I Bet Mark and Majella</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/bestbets" className="nav-link">
          Best Bets
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
