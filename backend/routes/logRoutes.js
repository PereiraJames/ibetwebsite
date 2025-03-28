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

router.get("/client-access", async (req, res) => {
    try {
        const { ip, userAgent, timestamp, url, referrer } = req.body;

        const logQuery = "INSERT INTO access_logs (ip, user_agent, timestamp, url, referrer) VALUES (?, ?, ?, ?, ?)";
        db.query(logQuery, [ip, userAgent, timestamp, url, referrer], (err, result) => {
            if (err) {
                console.error("Error logging access data:", err);
                return res.status(500).json({ message: "Error logging access data" });
            }
            res.status(201).json({ message: "Access data logged successfully" });
            console.log(`${ip} has successfully browsed to ${url}`)
        });

    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;