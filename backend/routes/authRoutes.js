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
router.get("/get-username", async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const getUserNameQuery = "SELECT username FROM users WHERE user_id = ?"

        db.query(getUserNameQuery, [userID], (err, result) => {
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
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get bets the user accepted.
router.get("/get-userinfo", async (req, res) => {
    try {
        const userID = await getUserIdFromToken(req);
        if (!userID) return res.status(401).json({ error: "Unauthorized" });

        const getUserInfoQuery = "SELECT * FROM users WHERE user_id = ?"

        db.query(getUserInfoQuery, [userID], (err, result) => {
            if (err) {
                console.error("Error fetching username:", err);
                return res.status(500).send("Error fetching data");
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "User Not Found" });
            }

            res.json({ userData: result[0] });
        })
    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/account-register", async (req, res) => {
    try {
        const { username, password, realname, phonenumber } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!realname) {
            return res.status(400).json({ message: "Realname is required" });
        }

        if (!phonenumber) {
            return res.status(400).json({ message: "Phone Number is required" });
        }

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
                db.query(userInsertQuery, [username, password, realname, phonenumber], (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Error creating user" });
                    }
                    console.log(`Successfully added new account ${username}`)
                    return res.status(201).json({ message: "User Added Successfully!" });
                });
            });
        });
    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/google-register", async (req, res) => {
    try {
        const { name, email, firstName, lastName, emailVerified, registeredMethod } = req.body;

        const emailCheckQuery = "SELECT * FROM googleUsersDev WHERE email = ?";
        db.query(emailCheckQuery, [email], async (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                return res.status(459).json({ message: "Email Exists!" });
            }

            const userInsertQuery = "INSERT INTO googleUsers (username, email, firstName, lastName, emailVerified, registeredMethod) VALUES (?,?,?,?,?,?)";
            db.query(userInsertQuery, [name, email, firstName, lastName, emailVerified, registeredMethod], (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ message: "Error creating user" });
                }
                console.log(`Successfully added new account ${name} | ${email}`)

                //To-do
                //Add a redirect to home page, meaning give it a JWT token so it auto logs in


                return res.status(201).json({ message: "User Added Successfully!" });
            });

        });
    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/account-login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

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
            return res.status(200).json({ token: generatedToken });
        });
    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/google-login", async (req, res) => {
    try {

        const { name, email, firstName, lastName, emailVerified, registeredMethod } = req.body;

        const usernameCheckQuery = "SELECT * FROM googleUsersDev WHERE email = ?";

        db.query(usernameCheckQuery, [email], (err, result) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Invalid email!" });
            }

            const user = result[0];

            console.log(user)

            // Creating JWT Token
            const generatedToken = jwt.sign({ id: user.email }, process.env.JWT_KEY, { expiresIn: "3h" });
            console.log(`${user.username} | ${user.email} has successfully logged in.`)
            return res.status(200).json({ token: generatedToken });
        });
    } catch (error) {
        console.error("Unexpected error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;