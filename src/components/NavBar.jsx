import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import BetButton from "./BetButton";
import LoginPopUp from "./LoginPopUp";

function NavBar() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
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
        // console.log("Fetched user data:", data); // Debugging log
        setUsername(data.userData.toUpperCase());
      } catch (error) {
        console.error("Failed to fetch username:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [JWTtoken]);

  // Function to handle logout
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

  // Detect scroll position to apply the 'navbar-scrolled' class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar-container ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="navbar-left-items">
          HOME
        </Link>
        <Link to="/bestbets" className="navbar-left-items">
          LEADERBOARDS
        </Link>
        <LoginPopUp />
      </div>
      <div className="navbar-center">
        <img
          src="src/css/images/mmmm.svg"
          className="mnm-logo"
          alt="mnm-logo"
        />
      </div>
      <div className="navbar-right">
        {JWTtoken && username ? (
          <div>
            <div className="dropdown-username" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {loading ? "Loading..." : username ? username : "Unknown"}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/userprofile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/likedbets" className="dropdown-item">
                    Best Bets
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        )}

        {JWTtoken && username && !loading && <BetButton />}
      </div>
    </nav>
  );
}

export default NavBar;
