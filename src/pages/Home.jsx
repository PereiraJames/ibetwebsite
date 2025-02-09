import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import BetButton from "../components/BetButton";
import FrontPageBanner from "../components/FrontBanner";
import Carousell from "../components/Carousell";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptedBets, setIsAccepted] = useState([]);

  const JWTtoken = localStorage.getItem("token");

  useEffect(() => {
    const fetchBetsAndAcceptedStatus = async () => {
      try {
        console.log("Fetching bets and accepted bets...");

        const [fetchedBets, response] = await Promise.all([
          getAllBets(),
          JWTtoken &&
            fetch("http://192.168.1.52:3000/bet/user-acceptedbets", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JWTtoken}`,
                "Content-Type": "application/json",
              },
            }),
        ]);

        console.log("Raw bets data:", fetchedBets);

        if (response) {
          const data = await response.json();
          console.log("Raw accepted bets data:", data);

          const acceptedBets = data || []; // Ensure it's an array
          console.log("Processed accepted bets array:", acceptedBets);

          // Merge `isAccepted` into bets
          const updatedBets = fetchedBets.map((bet) => {
            const isAccepted = acceptedBets.some(
              (accepted) => accepted.betid === bet.id
            );
            console.log(`Bet ID: ${bet.id}, isAccepted: ${isAccepted}`);
            return { ...bet, isAccepted };
          });

          console.log(
            "Final updated bets with acceptance status:",
            updatedBets
          );

          setBets(updatedBets);
        } else {
          // Handle the case where the user is not logged in (no JWT)
          setBets(fetchedBets); // Just set the bets without the accepted status
        }
      } catch (err) {
        console.error("Error fetching bets:", err);
        setError("Failed to load bets...");
      } finally {
        setLoading(false);
      }
    };

    if (JWTtoken) {
      fetchBetsAndAcceptedStatus();
    } else {
      // If no JWT, simply fetch the bets without checking accepted bets
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
  }, [JWTtoken]); // Ensure `JWTtoken` is available before making the request

  const handleSearch = (e) => {
    e.preventDefault();
    alert(searchQuery);
    setSearchQuery("I bet mark and majella will");
  };

  return (
    <div className="home">
      <FrontPageBanner />
      <Carousell />
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a bet"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="bet-grid">
          {bets
            .filter((bet) =>
              bet.text.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((bet) => (
              <BetCard bet={bet} key={bet.id} />
            ))}
        </div>
      )}
      <div className="bet-card-dropdown">test</div>
    </div>
  );
};

export default Home;
