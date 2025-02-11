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
      const getUserNameQuery = "SELECT username FROM users WHERE user_id = ?"

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

app.get("/auth/get-userinfo", async (req, res) => {
  try {
      const userId = await getUserIdFromToken(req);
      if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch username from database
      const getUserNameQuery = "SELECT * FROM users WHERE user_id = ?"

      db.query(getUserNameQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error fetching username:", err);
          return res.status(500).send("Error fetching data");
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "User Not Found" });
        }

        res.json({ userData: result[0] });
      });

  } catch (error) {
      console.error("Error fetching username:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//Creating an account
app.post("/auth/register", async (req, res) => {
  const { username, password, realname, phonenumber } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!realname){
    return res.status(400).json({ message: "Realname is required" });
  }

  if (!phonenumber){
    return res.status(400).json({ message: "Phone Number is required" });
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

      const phonenumberCheckQuery = "SELECT * FROM users WHERE phone_number = ?";
      db.query(phonenumberCheckQuery, [phonenumber], async (err, result) => {
        if (err) {
          console.error("Error checking user:", err);
          return res.status(500).json({ message: "Database error" });
        }
  
        if (result.length > 0) {
          return res.status(459).json({ message: "Phone Number Exists!" });
        }

        const userInsertQuery = "INSERT INTO users (username, password, realname, phone_number) VALUES (?,?,?,?)";
        db.query(userInsertQuery, [username, password, realname,phonenumber], (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Error creating user" });
          }
          console.log(`Successfully added new account ${username}`)
          return res.status(201).json({ message: "User Added Successfully!" });
        });
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
      const generatedToken = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: "3h" });
      console.log(`${user.user_id} | ${user.username} has successfully logged in.`)
      return res.status(200).json({token: generatedToken});
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/user/user-acceptedbets", async (req,res) => {
  const userID = await getUserIdFromToken(req);

  try{
    const userBetsQuery = "SELECT * FROM betaccepts WHERE user_id = ?";
    
    db.query(userBetsQuery, [userID], (err,results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json("Database Error!");
      }
      return res.json(results);
    })

  }catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/user/bet-liked", async (req,res) => {
  const userID = await getUserIdFromToken(req);

  try{
    const userBetsQuery = "SELECT * FROM betlikes WHERE user_id = ?";
    
    db.query(userBetsQuery, [userID], (err,results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json("Database Error!");
      }
      return res.json(results);
    })

  }catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/user/user-profileinfo", async (req,res) => {
  const userID = await getUserIdFromToken(req);

  const profileData = [];

  try{
    const userProfileQuery = "SELECT * FROM users WHERE id = ?"
    
    db.query(userProfileQuery, [userID], (err,results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json("Database Error!");
      }
      return res.json(results);
    })
  }catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
  
})

app.post("/user/bet-like", async (req, res) => {
  const { betId } = req.body;

  const userID = await getUserIdFromToken(req);

  if (!betId) {
    return res.status(400).json({ message: "Missing bet ID" });
  }

  try{
    const checkLikeExistQuery = "SELECT * FROM betlikes WHERE bet_id = ? AND user_id = ?";
    
    db.query(checkLikeExistQuery, [betId, userID], (err,results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json("Database Error!");
      }

      if (results.length > 0) {
        const unlikeQuery = "DELETE FROM betlikes WHERE user_id = ? AND bet_id = ?";

        db.query(unlikeQuery, [userID, betId], (err,results) => {
          if (err){
            console.error("Database Error:", err);
            return res.status(500).json("Database Error!");
          }

          console.log(`User ID ${userID} has unliked Bet ID ${betId}`);

          res.json({ success: true, liked: false });
        })
      }

      else{
        const likeQuery = "INSERT INTO betlikes (user_id, bet_id) VALUES (?, ?)";

        db.query(likeQuery, [userID, betId], (err,results) => {
          if (err){
            console.error("Database Error:", err);
            return res.status(500).json("Database Error!");
          }

          console.log(`User ID ${userID} has liked Bet ID ${betId}`);
          res.json({ success: true, liked: true });
        })
      }
    })
  }catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
  


  // const query = "UPDATE bets SET likes = likes + 1 WHERE bet_id = ?";
  // db.query(query, [betId], (err, result) => {
  //   if (err) {
  //     console.error("Error updating likes:", err);
  //     res.status(500).json({ message: "Error updating likes" });
  //     return;
  //   }
  //   res.json({ message: "Bet liked successfully!" });
  // });
});

// BET APIs

app.post("/bet/accept-bet", async (req, res) => {
  const { betID } = req.body;
  const userID = await getUserIdFromToken(req);

  try {
    // Check if the user has already accepted the bet
    const checkBetQuery = "SELECT * FROM betaccepts WHERE bet_id = ? AND user_id = ?";
    db.query(checkBetQuery, [betID, userID], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json("Database Error!");
      }

      // If a record exists, the user has already accepted the bet
      if (result.length > 0) {
        return res.status(400).json({ message: "You have already accepted this bet!" });
      }

      // If no record exists, proceed with inserting the new entry
      const UserAcceptBetQuery = "INSERT INTO betaccepts (bet_id, user_id) VALUES (?, ?)";
      db.query(UserAcceptBetQuery, [betID, userID], (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json("Database Error!");
        }
        return res.status(200).json({ message: "Successfully accepted bet!" });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET | Grab all the bets in the database
app.get("/api/bets", (req, res) => {
  db.query(`SELECT 
    b.bet_id, 
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    b.conditionals,
    COUNT(bl.like_id) AS likes_count
FROM bets b
LEFT JOIN betlikes bl 
    ON b.bet_id = bl.bet_id
GROUP BY 
    b.bet_id,  
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    b.conditionals;
`, (err, results) => {
    if (err) {
      console.error("Error fetching bets:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

app.get("/bet/leaderboard-bets", (req, res) => {
  db.query(`
    SELECT 
    b.bet_id, 
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    b.conditionals,
    COUNT(bl.like_id) AS likes_count
FROM bets b
LEFT JOIN betlikes bl 
    ON b.bet_id = bl.bet_id
GROUP BY 
    b.bet_id,  
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    b.conditionals
ORDER BY likes_count DESC
LIMIT 10;`, (err, results) => {
    if (err) {
      console.error("Error fetching bets:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

app.get("/bet/leaderboard-bettors", (req, res) => {
  db.query(`
   SELECT u.username, b.bettor_id, COUNT(b.bettor_id) AS total_bets
FROM bets b
JOIN users u ON b.bettor_id = u.user_id
GROUP BY b.bettor_id, u.username
ORDER BY total_bets DESC
LIMIT 10;
    `, (err, results) => {
    if (err) {
      console.error("Error fetching bets:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});


app.get("/bet/leaderboard-acceptors", (req, res) => {
  db.query(`
   SELECT u.username, ba.user_id, COUNT(ba.user_id) AS total_accepts
FROM betaccepts ba
JOIN users u ON ba.user_id = u.user_id
GROUP BY ba.user_id, u.username
ORDER BY total_accepts DESC
LIMIT 10;
`, (err, results) => {
    if (err) {
      console.error("Error fetching bets:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});


// POST | Creating a Bet
app.post("/bet/create-bet", async (req, res) => {
  const { text, betAmount, startDate, endDate, bettor, conditionals } = req.body;

  const bettorID = await getUserIdFromToken(req); 

  console.log(bettorID);

  if (!text || !betAmount || !startDate ||  !endDate || !bettorID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = "INSERT INTO bets (text, betAmount, startDate, endDate, bettor_id, conditionals) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [text, betAmount, startDate, endDate, bettorID, conditionals], (err, result) => {
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

  const query = "UPDATE bets SET likes = likes + 1 WHERE bet_id = ?";
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
