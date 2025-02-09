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

async function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
  }
  
  const token = authHeader.split(' ')[1];
  try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      return decoded.id; // Ensure your JWT includes an 'id' field
  } catch (error) {
      console.error('Invalid token:', error.message);
      return null;
  }
}

// USER AUTHENTICATION APIs

app.get("/auth/get-username", async (req, res) => {
  try {
      const userId = await getUserIdFromToken(req);
      if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch username from database
      const getUserNameQuery = "SELECT username FROM users WHERE id = ?"

      db.query(getUserNameQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error fetching username:", err);
          return res.status(500).send("Error fetching data");
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "User Not Found" });
        }

        res.json({ userData: result[0].username });
      });

  } catch (error) {
      console.error("Error fetching username:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//Creating an account
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
        console.log(`Successfully added new account ${username}`)
        return res.status(201).json({ message: "User Added Successfully!" });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Logining into account
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
      console.log(`${user.id} | ${user.username} has successfully logged in.`)
      return res.status(200).json({token: generatedToken});
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// BET APIs

app.post("/bet/accept-bet", (req, res) => {
  const {}

  //add the persons name to the bet acceptor.

  //make sure it is able for other to accept the bet.
})

app.post("/bets/accept-bet", (req,res) => {
  const {username, userid} = req.body;

  if (!userid) {
    return res.status(400).json({message: "Need to be logged in."})
  };

  try{
    const BetInfoQuery = "SELECT * FROM bets WHERE id = ?";
    db.query(BetInfoQuery, [betId], (err, result) => {
      if (err){
        return res.status(500).json("Database Error!");
      }
      return res.status(200).json({message : "Successfully accepted bet!"})
    });
  } catch (err){
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
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
  const { text, betAmount, startDate, endDate, bettor, conditionals } = req.body;

  if (!text || !betAmount || !startDate ||  !endDate || !bettor) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = "INSERT INTO bets (text, betAmount, startDate, endDate, bettor, conditionals) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [text, betAmount, startDate, endDate, bettor, conditionals], (err, result) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
