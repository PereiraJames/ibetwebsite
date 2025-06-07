import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import BestBets from "./pages/BestBets";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import GoogleRegister from "./pages/GoogleRegister";
import Login from "./pages/Login";
import "./css/App.css";
import UserProfile from "./pages/UserProfile";
import LikedBets from "./pages/LikedBets";
import Leaderboards from "./pages/LeaderBoards";
import HowToPlay from "./pages/HowToPlay";
import AcceptedBets from "./pages/AcceptedBets";

function App() {
  const [refresh, setRefresh] = useState(false); // Track page changes for re-render
  const location = useLocation(); // Get the current route location

  // Trigger refresh on route change
  useEffect(() => {
    setRefresh(true);
    // Reset refresh flag after the re-render
    const timer = setTimeout(() => setRefresh(false), 0);
    return () => clearTimeout(timer);
  }, [location]); // Re-run effect on route change

  // useEffect(() => {
  //   logClientAccess();
  // }, []);

  return (
    <div>
      <NavBar />
      <main>
        {/* Pass refresh state as a prop if needed to other components */}
        <Routes key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/bestbets" element={<BestBets />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-register" element={<GoogleRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/likedbets" element={<LikedBets />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route path="/acceptedbets" element={<AcceptedBets />} />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
