import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";
import cors from "cors";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// API endpoint to fetch bets
app.get("/api/bets", (req, res) => {
  db.query("SELECT * FROM bets", (err, results) => {
    if (err) {
      console.error("Error fetching bets:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

// API endpoint to create a new bet
app.post("/api/bets", (req, res) => {
  const { text, betAmount, startDate, endDate, bettor, conditionals, phoneNo } = req.body;

  // Validate incoming data (optional but recommended)
  if (!text || !betAmount || !startDate ||  !endDate || !bettor || !phoneNo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert new bet into the database
  const query = "INSERT INTO bets (text, betAmount, startDate, endDate, bettor, conditionals, phoneNo) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [text, betAmount, startDate, endDate, bettor, conditionals, phoneNo], (err, result) => {
    if (err) {
      console.error("Error inserting bet:", err);
      res.status(500).json({ message: "Error creating bet" });
      return;
    }
    res.status(201).json({ message: "Bet created successfully!", betId: result.insertId });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
