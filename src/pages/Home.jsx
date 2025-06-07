import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import FrontPageBanner from "../components/FrontBanner";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptedBets, setIsAccepted] = useState([]);
  const [likedBets, setLikedBets] = useState([]);
  const ENDPOINT_URL = import.meta.env.VITE_ENDPOINT_URL;

  const JWTtoken = localStorage.getItem("token");
  useEffect(() => {
    const fetchBetsAndStatuses = async () => {
      try {
        // console.log("Fetching bets, accepted bets, and liked bets...");

        const [fetchedBets, acceptedResponse, likedResponse] =
          await Promise.all([
            getAllBets(),
            JWTtoken &&
              fetch(`${ENDPOINT_URL}/user/acceptedbets`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${JWTtoken}`,
                  "Content-Type": "application/json",
                },
              }),
            JWTtoken &&
              fetch(`${ENDPOINT_URL}/user/likedbets`, {
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
        setLoading(false);
      }
    };

    if (JWTtoken) {
      fetchBetsAndStatuses();
    } else {
      // If no JWT, simply fetch the bets without checking accepted or liked bets
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
  }, [JWTtoken]); // Make sure to run this effect whenever JWTtoken changes
  // Ensure `JWTtoken` is available before making the request

  const handleSearch = (e) => {
    e.preventDefault();
    // alert(searchQuery);
    setSearchQuery("I bet mark and majella will");
  };

  return (
    <div className="home">
      <FrontPageBanner />
      {/* <Carousell /> */}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container-home">
          <div className="loading-home"></div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for a bet"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="bet-grid">
            {bets
              .filter((bet) =>
                bet.text.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((bet) => (
                <BetCard bet={bet} key={bet.bet_id} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
