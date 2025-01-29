import Home from "./pages/Home";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import BestBets from "./pages/BestBets";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-context">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bestbets" element={<BestBets />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
