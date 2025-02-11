import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";

const AcceptedBets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const JWTtoken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBetsAndStatuses = async () => {
      try {
        const [fetchedBets, acceptedResponse, likedResponse] =
          await Promise.all([
            getAllBets(),
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

        const acceptedBets = acceptedResponse
          ? await acceptedResponse.json()
          : [];
        const likedBets = likedResponse ? await likedResponse.json() : [];

        const updatedBets = fetchedBets.map((bet) => {
          const isAccepted = acceptedBets.some(
            (accepted) => accepted.bet_id === bet.bet_id
          );
          const isLiked = likedBets.some(
            (liked) => liked.bet_id === bet.bet_id
          );

          return { ...bet, isAccepted, isLiked };
        });

        setBets(updatedBets);
      } catch (err) {
        console.error("Error fetching bets:", err);
        setError("Failed to load bets...");
      } finally {
        setLoading(false);
      }
    };

    if (JWTtoken) {
      fetchBetsAndStatuses();
    } else {
      getAllBets()
        .then((fetchedBets) => {
          setBets(fetchedBets);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching bets:", err);
          setError("Failed to load bets...");
          setLoading(false);
        });
    }
  }, [JWTtoken]);

  const filteredBets = bets
    .filter((bet) => bet.isAccepted) // Filter to show only liked bets
    .filter((bet) =>
      bet.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="home">
      <div className="navbar-offset"></div>
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="bet-grid">
          {filteredBets.length === 0 ? (
            <div className="no-bets-message">
              You have not accepted any bets yet.
            </div>
          ) : (
            filteredBets.map((bet) => <BetCard bet={bet} key={bet.bet_id} />)
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedBets;
