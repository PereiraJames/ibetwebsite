import React, { useEffect, useState } from "react";
import "../css/Leaderboard.css"; // Make sure this is linked
import { getLeaderboardBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";

const Leaderboards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [bettors, setBettors] = useState([]);
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardloading, setLeaderBoardLoading] = useState(true);
  const [bettorloading, setBettorLoading] = useState(true);
  const [acceptorloading, setAcceptorLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptedBets, setIsAccepted] = useState([]);

  const JWTtoken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBetsAndAcceptedStatus = async () => {
      try {
        const [fetchedBets, acceptedResponse, likedResponse] =
          await Promise.all([
            getLeaderboardBets(),
            JWTtoken &&
              fetch("http://192.168.1.52:3000/user/user-acceptedbets", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${JWTtoken}`,
                  "Content-Type": "application/json",
                },
              }),
            JWTtoken &&
              fetch("http://192.168.1.52:3000/user/bet-liked", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${JWTtoken}`,
                  "Content-Type": "application/json",
                },
              }),
          ]);

        // console.log("Raw bets data:", fetchedBets);

        const acceptedBets = acceptedResponse
          ? await acceptedResponse.json()
          : [];
        const likedBets = likedResponse ? await likedResponse.json() : [];

        // console.log("Processed accepted bets:", acceptedBets);
        // console.log("Processed liked bets:", likedBets);

        // Merge `isAccepted` and `isLiked` into bets
        const updatedBets = fetchedBets.map((bet) => {
          const isAccepted = acceptedBets.some(
            (accepted) => accepted.bet_id === bet.bet_id
          );
          const isLiked = likedBets.some(
            (liked) => liked.bet_id === bet.bet_id
          );

          // console.log(
          //   `Bet ID: ${bet.bet_id}, isAccepted: ${isAccepted}, isLiked: ${isLiked}`
          // );

          return { ...bet, isAccepted, isLiked };
        });

        setBets(updatedBets);
      } catch (err) {
        console.error("Error fetching bets:", err);
        setError("Failed to load bets...");
      } finally {
        setLeaderBoardLoading(false);
      }
    };

    fetchBetsAndAcceptedStatus(); // Fetch bets and accepted status without JWT logic

    // Fetch additional leaderboard data regardless of JWT status
    const fetchLeaderboardData = async () => {
      try {
        const [fetchedBettors, fetchedAcceptors] = await Promise.all([
          fetch("http://192.168.1.52:3000/bet/leaderboard-bettors", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch("http://192.168.1.52:3000/bet/leaderboard-acceptors", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        const bettorsData = await fetchedBettors.json();
        const acceptorsData = await fetchedAcceptors.json();

        setBettors(bettorsData);
        setAcceptors(acceptorsData);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data...");
      } finally {
        setBettorLoading(false);
        setAcceptorLoading(false);
      }
    };

    fetchLeaderboardData(); // Fetch leaderboard data always
  }, [JWTtoken]); // Depend on JWTtoken, but only for fetching bets and accepted status

  return (
    <div className="leaderboard">
      <div className="navbar-offset"></div>
      {error && <div className="error-message">{error}</div>}
      <div className="top-players-container">
        <p className="player-title">TOP BETTORS</p>
        {bettorloading ? (
          <div className="loading">Loading Bettors...</div>
        ) : (
          <div className="player-grid">
            {bettors.map((bettor) => (
              <div className="player-card" key={bettor.bettor_id}>
                <h3>{bettor.username.toUpperCase()}</h3>
                <p>Total Bets: {bettor.total_bets}</p>
                {/* Add more details from the `bettor` object as needed */}
              </div>
            ))}
          </div>
        )}
        <p className="player-title">TOP Acceptors</p>
        {acceptorloading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="player-grid">
            {acceptors.map((acceptors) => (
              <div className="player-card" key={acceptors.user_id}>
                <h3>{acceptors.username.toUpperCase()}</h3>
                <p>Total Bets: {acceptors.total_accepts}</p>
                {/* Add more details from the `bettor` object  as needed */}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="top-bets-container">
        <p className="bet-title">TOP BETS</p>
        {leaderboardloading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="bet-grid">
            {bets
              .filter((bet) =>
                bet.text.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((bet) => (
                <BetCard bet={bet} key={bet.bet_id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;
