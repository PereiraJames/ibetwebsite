import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import BetButton from "./BetButton";

function NavBar() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const JWTtoken = localStorage.getItem("token");
  const dropdownRef = useRef(null); // Reference to the dropdown

  useEffect(() => {
    const fetchUserName = async () => {
      if (!JWTtoken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.1.52:3000/auth/get-username",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${JWTtoken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched user data:", data); // Debugging log
        setUsername(data.userData);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [JWTtoken]); // Ensure JWTtoken is a dependency

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    setLoading(true);
  };

  // Function to handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          {/* <img src="src/css/images/Logo_Trans.png" alt="MnMTransLogo" /> */}
          <p>I Bet Mark and Majella</p>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/bestbets" className="nav-link">
          Best Bets
        </Link>

        {JWTtoken ? (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {loading ? "Loading..." : username ? username : "Guest"}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/userprofile" className="dropdown-item">
                  Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        )}

        {JWTtoken && !loading && <BetButton />}
      </div>
    </nav>
  );
}

export default NavBar;
