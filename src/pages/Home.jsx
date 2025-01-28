import React, { useEffect, useState } from "react";
import "../css/Home.css"; // Make sure this is linked
import { getAllBets } from "../services/database"; // Update this based on your path
import BetCard from "../components/BetCard";

const Home = () => {
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
    setSearchQuery("");
  };

  if (loading) return <p>Loading bets...</p>;
  if (error) return <p>{error}</p>;
  if (!bets.length) return <p>No bets found</p>;

  return (
    <div className="home">
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

      <div className="bet-grid">
        {bets
          .filter((bet) =>
            bet.text.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((bet) => (
            <BetCard bet={bet} key={bet.id} />
          ))}
      </div>
    </div>
  );
};

export default Home;
