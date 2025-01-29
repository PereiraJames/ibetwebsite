import dotenv from "dotenv";
import express, { query } from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Jason Database
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

// GET | Grab all the bets in the database
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


// POST | Creating a Bet
app.post("/api/bets", (req, res) => {
  const { text, betAmount, startDate, endDate, bettor, conditionals, phoneNo } = req.body;

  if (!text || !betAmount || !startDate ||  !endDate || !bettor || !phoneNo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

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

app.post("/api/bets/like", (req, res) => {
  const { betId } = req.body;

  if (!betId) {
    return res.status(400).json({ message: "Missing bet ID" });
  }

  const query = "UPDATE bets SET likes = likes + 1 WHERE id = ?";
  db.query(query, [betId], (err, result) => {
    if (err) {
      console.error("Error updating likes:", err);
      res.status(500).json({ message: "Error updating likes" });
      return;
    }
    res.json({ message: "Bet liked successfully!" });
  });
});

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const usernameCheckQuery = "SELECT * FROM users WHERE username = ?";
    db.query(usernameCheckQuery, [username], async (err, result) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(459).json({ message: "User Already Exists!" });
      }

      // Insert new user
      const userInsertQuery = "INSERT INTO users (username, password) VALUES (?,?)";
      db.query(userInsertQuery, [username, password], (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ message: "Error creating user" });
        }
        return res.status(201).json({ message: "User Added Successfully!" });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if user exists
    const usernameCheckQuery = "SELECT * FROM users WHERE username = ?";
    
    db.query(usernameCheckQuery, [username], (err, result) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Invalid Username!" });
      }

      const user = result[0];

      console.log(user)

      // Plaintext password comparison (Not recommended for production)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid Password!" });
      }

      // Creating JWT Token
      const generatedToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: "3h" });
      console.log(generatedToken)
      return res.status(200).json({token: generatedToken});
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
