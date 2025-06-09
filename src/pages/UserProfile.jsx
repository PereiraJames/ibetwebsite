import "../css/UserProfile.css";
import React, { useState, useEffect, useRef } from "react";
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import { isJWTValid } from "../services/utils";

const UserProfile = () => {
  const JWTtoken = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bets, setBets] = useState([]);

  if (!isJWTValid(JWTtoken) && JWTtoken) {
    localStorage.removeItem('token');
    console.log('Invalid or expired token removed.');
  }  

  if (!JWTtoken) {
    return (
      <div className="register-container">
        <div className="navbar-space"></div>
        <div className="register-form-local">
          <h2>Sign In to View Your Profile</h2>
          <a href="/login">Login</a>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchUserCredentials = async () => {
      try {
        const response = await fetch(`${ENDPOINT_URL}/auth/get-userinfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JWTtoken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user info");
        
        const data = await response.json();
        console.log("Fetched user info:", data); 
        setUserInfo(data); // Store it in state
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user info...");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBets = async () => {
      try {
        const response = await fetch(`${ENDPOINT_URL}/user/users-bet`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JWTtoken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user info");
        
        const userbets = await response.json();
        console.log("Fetched user Bets:", userbets); 
        setBets(userbets); // Store it in state
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user info...");
      } finally {
        setLoading(false);
      }
    };
  
    if (JWTtoken) {
      fetchUserCredentials();
      fetchUserBets();
    }
  }, [JWTtoken, ENDPOINT_URL]); 


  return (
    <div className="userprofile-container">
      <div className="navbar-void"></div>
      <div className="profile-grid">
        <div className="profile-row">
          <span className="label">Username:</span>
          <span className="value">{userInfo.userData?.username || "-"}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email:</span>
          <span className="value">{userInfo.userData?.email || "-"}</span>
        </div>
        <div className="profile-row">
          <span className="label">Total Bets:</span>
          <span className="value">{userInfo.userData?.total_bets_created || "No Bets Created"}</span>
        </div>
      </div>
      <div className="profile-bets">
        <div className="profile-created-bets-title">Created Bets</div>
        <div className="profile-bet">
          {bets.map((bet) => (
              <BetCard bet={bet} key={bet.bet_id} />
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default UserProfile;