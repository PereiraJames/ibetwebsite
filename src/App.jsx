import Home from "./pages/Home";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import BestBets from "./pages/BestBets";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-context">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bestbets" element={<BestBets />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
