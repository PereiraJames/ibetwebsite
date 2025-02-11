import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getLeaderboardBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import BetButton from "../components/BetButton";
import FrontPageBanner from "../components/FrontBanner";
import Carousell from "../components/Carousell";

const Home = () => {
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
        const [fetchedBets, response] = await Promise.all([
          getLeaderboardBets(),
          JWTtoken &&
            fetch("http://192.168.1.52:3000/user/user-acceptedbets", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JWTtoken}`,
                "Content-Type": "application/json",
              },
            }),
        ]);

        if (response) {
          const data = await response.json();

          const acceptedBets = data || []; // Ensure it's an array

          // Merge `isAccepted` into bets
          const updatedBets = fetchedBets.map((bet) => {
            const isAccepted = acceptedBets.some(
              (accepted) => accepted.bet_id === bet.bet_id
            );
            return { ...bet, isAccepted };
          });

          setBets(updatedBets);
        } else {
          // Handle the case where the user is not logged in (no JWT)
          setBets(fetchedBets); // Just set the bets without the accepted status
        }
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
    <div className="home">
      {error && <div className="error-message">{error}</div>}
      <p>TOP BETTORS</p>
      {bettorloading ? (
        <div className="loading">Loading Bettors...</div>
      ) : (
        <div className="bet-grid">
          {bettors.map((bettor) => (
            <div className="bettor-card" key={bettor.id}>
              <h3>{bettor.username}</h3>
              <p>Total Bets: {bettor.total_bets}</p>
              {/* Add more details from the `bettor` object as needed */}
            </div>
          ))}
        </div>
      )}
      <p>TOP Acceptors</p>
      {acceptorloading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="bet-grid">
          {acceptors.map((acceptors) => (
            <div className="bettor-card" key={acceptors.id}>
              <h3>{acceptors.username}</h3>
              <p>Total Bets: {acceptors.total_accepts}</p>
              {/* Add more details from the `bettor` object as needed */}
            </div>
          ))}
        </div>
      )}
      <p>TOP BETS</p>
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
  );
};

export default Home;
