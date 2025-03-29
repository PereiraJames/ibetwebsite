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

// Function to extract User ID from JWT
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

// Get username based on the userID
router.get("/get-username", async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const getUserNameQuery = "SELECT username FROM users WHERE user_id = ?";

        db.query(getUserNameQuery, [userID], (err, result) => {
            if (err) {
                console.error("Error fetching username:", err);
                return res.status(500).send({ message: "Error fetching data" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User Not Found" });
            }

            res.json({ userData: result[0].username });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get user info based on the userID
router.get("/get-userinfo", async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const getUserInfoQuery = "SELECT * FROM users WHERE user_id = ?";

        db.query(getUserInfoQuery, [userID], (err, result) => {
            if (err) {
                console.error("Error fetching user info:", err);
                return res.status(500).send("Error fetching data");
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User Not Found" });
            }

            res.json({ userData: result[0] });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Account registration
router.post("/account-register", async (req, res) => {
    try {
        const { username, password, realname, phonenumber } = req.body;

        // Validate input
        if (!password || !username || !realname || !phonenumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const usernameCheckQuery = "SELECT * FROM defaultUsers WHERE username = ?";
        db.query(usernameCheckQuery, [username], (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(459).json({ message: "User Already Exists!" });
            }

            const phonenumberCheckQuery = "SELECT * FROM defaultUsers WHERE phone_number = ?";
            db.query(phonenumberCheckQuery, [phonenumber], (err, result) => {
                if (err) {
                    console.error("Error checking phone number:", err);
                    return res.status(500).json({ message: "Database error" });
                }

                if (result.length > 0) {
                    return res.status(459).json({ message: "Phone Number Exists!" });
                }

                const userInsertQuery = "INSERT INTO defaultUsers (username, password, realname, phone_number) VALUES (?,?,?,?)";
                db.query(userInsertQuery, [username, password, realname, phonenumber], (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Error creating user" });
                    }
                    console.log(`Successfully added new account ${username}`);
                    return res.status(201).json({ message: "User Added Successfully!" });
                });
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Google registration
router.post("/google-register", async (req, res) => {
    try {
        const { name, email, firstName, lastName, emailVerified } = req.body;

        // Check if email already exists in googleUsers table
        const emailCheckQuery = "SELECT * FROM googleUsers WHERE email = ?";
        db.query(emailCheckQuery, [email], (err, result) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(459).json({ message: "Email Exists!" });
            }

            // Insert into googleUsers table
            const userInsertQuery = "INSERT INTO googleUsers (username, email, firstName, lastName, emailVerified) VALUES (?,?,?,?,?)";
            db.query(userInsertQuery, [name, email, firstName, lastName, emailVerified], (err, result) => {
                if (err) {
                    console.error("Error inserting user into googleUsers:", err);
                    return res.status(500).json({ message: "Error creating user" });
                }
                console.log(`Successfully added new Google account ${name} | ${email}`);

                // Now insert into the central users table
                const usersDevInsertQuery = "INSERT INTO users (username, email, source, registeredMethod, google_user_id) VALUES (?,?,?,?,?)";
                db.query(usersDevInsertQuery, [name, email, 'google', 'google', result.insertId], (err, result) => {
                    if (err) {
                        console.error("Error inserting into users:", err);
                        return res.status(500).json({ message: "Error tracking user" });
                    }

                    console.log(`Successfully added user to central users table ${name} | ${email}`);

                    // Create JWT token for the new user
                    const generatedToken = jwt.sign({ id: result.insertId }, process.env.JWT_KEY, { expiresIn: "3h" });
                    return res.status(201).json({ message: "User Added Successfully!", token: generatedToken });
                });
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Account login
router.post("/account-login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const usernameCheckQuery = "SELECT * FROM defaultUsers WHERE username = ?";
        db.query(usernameCheckQuery, [username], (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Invalid Username!" });
            }

            const user = result[0];

            // Plaintext password comparison (not recommended for production)
            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid Password!" });
            }

            // Creating JWT Token
            const generatedToken = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: "3h" });
            console.log(`${user.user_id} | ${user.username} has successfully logged in.`);
            return res.status(200).json({ token: generatedToken });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Google login
router.post("/google-login", async (req, res) => {
    try {
        const { email } = req.body;

        const usernameCheckQuery = "SELECT * FROM googleUsers WHERE email = ?";
        db.query(usernameCheckQuery, [email], (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Invalid email!" });
            }

            const user = result[0];

            // Creating JWT Token
            const generatedToken = jwt.sign({ id: user.email }, process.env.JWT_KEY, { expiresIn: "3h" });
            console.log(`${user.username} | ${user.email} has successfully logged in.`);
            return res.status(200).json({ token: generatedToken });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
