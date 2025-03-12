import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Connect to Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//Captures the JWT token from and parses it into the userID
async function getUserIdFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        //returns the userID
        return decoded.id;
    } catch (error) {
        return null;
    }
}

router.post('/accept-bet', async (req, res) => {
    try {
        const { betID } = req.body;
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });
        if (!betID) return res.status(401).json({ error: "Unable to find betID" });

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

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/all-bets', async (req, res) => {
    try {

        const allBetQuery = `SELECT 
    b.bet_id, 
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    u.username,  -- Add the username field from the users table
    b.conditionals,
    COUNT(bl.like_id) AS likes_count
FROM bets b
LEFT JOIN betlikes bl 
    ON b.bet_id = bl.bet_id
LEFT JOIN users u  -- Join with users table
    ON b.bettor_id = u.user_id  -- Match bettor_id with user_id
GROUP BY 
    b.bet_id,  
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    u.username,  -- Include username in GROUP BY
    b.conditionals
ORDER BY b.bet_id DESC;  -- Order by bet_id in descending order`;

        db.query(allBetQuery, (err, results) => {
            if (err) {
                console.error("Error fetching bets:", err);
                return res.status(500).json("Database Error!");
            }
            return res.json(results);
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/leaderboard-bets', async (req, res) => {
    try {

        const leaderboardBetQuery = `SELECT 
    b.bet_id, 
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    u.username,  -- Add the username field from the users table
    b.conditionals,
    COUNT(bl.like_id) AS likes_count
FROM bets b
LEFT JOIN betlikes bl 
    ON b.bet_id = bl.bet_id
LEFT JOIN users u  -- Join with the users table to get the username
    ON b.bettor_id = u.user_id  -- Match bettor_id with user_id
GROUP BY 
    b.bet_id,  
    b.text, 
    b.betamount, 
    b.startdate,
    b.enddate,
    b.bettor_id,
    u.username,  -- Include username in GROUP BY
    b.conditionals
ORDER BY likes_count DESC
LIMIT 10;`;

        db.query(leaderboardBetQuery, (err, results) => {
            if (err) {
                console.error("Error fetching bets:", err);
                return res.status(500).json("Database Error!");
            }
            return res.json(results);
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/leaderboard-bettors', async (req, res) => {
    try {

        const leaderboardBettorsQuery = ` SELECT u.username, b.bettor_id, COUNT(b.bettor_id) AS total_bets
FROM bets b
JOIN users u ON b.bettor_id = u.user_id
GROUP BY b.bettor_id, u.username
ORDER BY total_bets DESC
LIMIT 10;`;

        db.query(leaderboardBettorsQuery, (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json("Database Error!");
            }
            return res.json(results);
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/leaderboard-acceptors', async (req, res) => {
    try {

        const leaderboardAcceptorsQuery = `SELECT u.username, ba.user_id, COUNT(ba.user_id) AS total_accepts
FROM betaccepts ba
JOIN users u ON ba.user_id = u.user_id
GROUP BY ba.user_id, u.username
ORDER BY total_accepts DESC
LIMIT 10;`;

        db.query(leaderboardAcceptorsQuery, (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json("Database Error!");
            }
            return res.json(results);
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/create-bet', async (req, res) => {
    try {
        const { text, betAmount, startDate, endDate, bettor, conditionals } = req.body;

        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        if (!text || !betAmount || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const createBetQuery = "INSERT INTO bets (text, betAmount, startDate, endDate, bettor_id, conditionals) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(createBetQuery, [text, betAmount, startDate, endDate, userID, conditionals], (err, result) => {
            if (err) {
                console.error("Error inserting bet:", err);
                res.status(500).json({ message: "Error creating bet" });
                return;
            }
            console.log(`User ID ${userID} just made a bet || ${text}`)
            res.status(201).json({ message: "Bet created successfully!", betId: result.insertId });
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;