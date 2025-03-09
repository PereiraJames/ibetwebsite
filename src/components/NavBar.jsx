import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/NavBar.css";
import BetButton from "./BetButton";
import logo from "../css/images/mnm_logo.png"; // Import the logo image

// Navbar for mobile view
function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const JWTtoken = localStorage.getItem("token");
  const dropdownRef = useRef(null); // Reference to the dropdown
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  // Add or remove class to body to prevent scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    // Cleanup on unmount or when menu is closed
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Fetch username from the backend
  useEffect(() => {
    const fetchUserName = async () => {
      if (!JWTtoken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${ENDPOINT_URL}/api/auth/get-username`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JWTtoken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
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
    setDropdownOpen(false);
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
    <div className="navbar-mobile">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <button class="mobile-hamburger-icon" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={closeMenu}>×</button>
        {/* User Dropdown if logged in */}
        {JWTtoken && username ? (
          <div className="mobile-menu-dropdown" ref={dropdownRef}>
            <div className="mobile-menu-name">{username}</div>
            <Link to="/" className="mobile-menu-item" onClick={closeMenu}>
              HOME
            </Link>
            <Link to="/leaderboards" className="mobile-menu-item" onClick={closeMenu}>
              LEADERBOARDS
            </Link>
            <Link to="/howtoplay" className="mobile-menu-item" onClick={closeMenu}>
              HOW TO PLAY
            </Link>
            <Link to="/userprofile" className="mobile-menu-item" onClick={closeMenu}>
                PROFILE
              </Link>
              <Link to="/likedbets" className="mobile-menu-item" onClick={closeMenu}>
                LIKED BETS
              </Link>
              <Link to="/acceptedbets" className="mobile-menu-item" onClick={closeMenu}>
                ACCEPTED BETS
              </Link>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="mobile-menu-logout">
                LOGOUT
              </button>
          </div>
        ) : (
          <div className="mobile-menu-dropdown" ref={dropdownRef}>
            <Link to="/" className="mobile-menu-item" onClick={closeMenu}>
              HOME
            </Link>
            <Link to="/leaderboards" className="mobile-menu-item" onClick={closeMenu}>
              LEADERBOARDS
            </Link>
            <Link to="/howtoplay" className="mobile-menu-item" onClick={closeMenu}>
              HOW TO PLAY
            </Link>
            <Link to="/login" className="mobile-menu-item" onClick={closeMenu}>
              LOGIN
            </Link>
          </div>
        )}

        {/* Bet Button if logged in */}
        {JWTtoken && username && !loading && <BetButton />}
      </div>
    </div>
  );
}

// Navbar for desktop view
function NavbarDesktop() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const JWTtoken = localStorage.getItem("token");
  const dropdownRef = useRef(null); // Reference to the dropdown
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;
  const location = useLocation(); 


  useEffect(() => {
    const fetchUserName = async () => {
      if (!JWTtoken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${ENDPOINT_URL}/api/auth/get-username`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JWTtoken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

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
    setDropdownOpen(false);
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
    <div className="navbar-desktop">
      <div className="navbar-left">
        <Link to="/" className="nav-item">
          HOME
        </Link>
        <Link to="/leaderboards" className="nav-item">
          LEADERBOARDS
        </Link>
        <Link to="/howtoplay" className="nav-item">
          HOW TO PLAY
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {JWTtoken && username ? (
          <div className="dropdown-username" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {loading ? "Loading..." : username}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/userprofile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/likedbets" className="dropdown-item">
                  Favourite Bets
                </Link>
                <Link to="/acceptedbets" className="dropdown-item">
                  Accepted Bets
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-login">
            LOGIN
          </Link>
        )}
        {JWTtoken && username && !loading && <BetButton />}
      </div>
    </div>
  );
}

// Main Navbar component to handle both views
function Navbar() {
  const isMobile = window.innerWidth <= 768; // You can adjust this value as needed

  return (
    <div>
      {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
    </div>
  );
}

export default Navbar;
