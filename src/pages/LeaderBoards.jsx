import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";
import BetButton from "../components/BetButton";
import FrontPageBanner from "../components/FrontBanner";

const Leaderboards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const fetchedBets = await getAllBets();
        setBets(fetchedBets);
      } catch (err) {
        setError("Failed to load bets...");
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(searchQuery);
    setSearchQuery("I bet mark and majella will");
  };

  return (
    <div className="home">
      <FrontPageBanner />
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

      {/* <BetButton></BetButton> */}

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

export default Leaderboards;
