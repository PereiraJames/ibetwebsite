import React, { useEffect, useState } from "react";
import "../css/LikedBets.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import { isJWTValid } from "../services/utils";

const LikedBets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const JWTtoken = localStorage.getItem("token");
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  if (!isJWTValid(JWTtoken) && JWTtoken) {
    localStorage.removeItem('token');
    console.log('Invalid or expired token removed.');
  }

  useEffect(() => {
    const fetchBetsAndStatuses = async () => {
      try {
        const [fetchedBets, likedResponse] = await Promise.all([
          getAllBets(),
          JWTtoken &&
            fetch(`${ENDPOINT_URL}/user/likedbets`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JWTtoken}`,
                "Content-Type": "application/json",
              },
            }),
        ]);

        const likedBets = likedResponse ? await likedResponse.json() : [];

        const updatedBets = fetchedBets.map((bet) => {
          const isLiked = likedBets.some(
            (liked) => liked.bet_id === bet.bet_id
          );

          return { ...bet, isLiked };
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
    .filter((bet) => bet.isLiked) // Filter to show only liked bets
    .filter((bet) =>
      bet.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="likedbets">
      {/* <div className="navbar-offset"></div> */}
      {error && <div className="error-message">{error}</div>}
      <div className="liked-bets-banner ">
        <div className="liked-bets-title">
          <h1>YOUR FAVOURITE BETS</h1>
        </div>
      </div>
      {loading ? (
        <div className="loading-container-bets">
          <div className="loading-bets"></div>
        </div>
      ) : (
        <div className="bet-grid">
          {filteredBets.length === 0 ? (
            <div className="no-bets-message">
              You have not liked any bets yet.
            </div>
          ) : (
            filteredBets.map((bet) => <BetCard bet={bet} key={bet.bet_id} />)
          )}
        </div>
      )}
    </div>
  );
};

export default LikedBets;
