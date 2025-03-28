import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const router = express.Router();

// Connect to Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function getUserIdFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return decoded.id;
    } catch (error) {
        return null;
    }
}

// Get bets the user accepted.
router.get("/acceptedbets", async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const userBetsQuery = "SELECT * FROM betaccepts WHERE user_id = ?";

        db.query(userBetsQuery, [userID], (err, results) => {
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

//All liked bets from users
router.get('/likedbets', async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const userBetsQuery = "SELECT * FROM betlikes WHERE user_id = ?";

        db.query(userBetsQuery, [userID], (err, results) => {
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

//All account users info
router.get('/profileinfo', async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const userProfileQuery = "SELECT * FROM users WHERE id = ?"

        db.query(userProfileQuery, [userID], (err, results) => {
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

//Handles likes and dislikes from user
router.post('/bet-like', async (req, res) => {
    try {
        const { betId } = req.body;

        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const checkLikeExistQuery = "SELECT * FROM betlikes WHERE bet_id = ? AND user_id = ?";

        db.query(checkLikeExistQuery, [betId, userID], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json("Database Error!");
            }

            if (!betId || !userID) {
                console.error("Invalid")
                return res.status(404).json("Unauthorized | Not logged!")
            }

            if (results.length > 0) {
                const unlikeQuery = "DELETE FROM betlikes WHERE user_id = ? AND bet_id = ?";

                db.query(unlikeQuery, [userID, betId], (err, results) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json("Database Error!");
                    }

                    console.log(`User ID ${userID} has unliked Bet ID ${betId}`);

                    res.json({ success: true, liked: false });
                })
            }

            else {
                const likeQuery = "INSERT INTO betlikes (user_id, bet_id) VALUES (?, ?)";

                db.query(likeQuery, [userID, betId], (err, results) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json("Database Error!");
                    }

                    console.log(`User ID ${userID} has liked Bet ID ${betId}`);
                    res.json({ success: true, liked: true });
                })
            }
        })

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
