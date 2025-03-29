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
        const { username, password, realname, phonenumber, email } = req.body;

        // Validate input
        if (!password || !username || !realname || !phonenumber || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // // Check if username already exists
        // const usernameExists = await checkIfExists("username", username);
        // if (usernameExists) {
        //     return res.status(459).json({ message: "Username Already Exists!" });
        // }

        // Check if phone number already exists
        const phoneExists = await checkIfExists("phone_number", phonenumber);
        if (phoneExists) {
            return res.status(459).json({ message: "Phone Number Exists!" });
        }

        // Check if email already exists
        const emailExists = await checkIfExists("email", email);
        if (emailExists) {
            return res.status(459).json({ message: "Email Already Exists!" });
        }

        // Insert new user into the database
        const insertQuery = "INSERT INTO defaultUsers (username, password, realname, phone_number, email) VALUES (?, ?, ?, ?, ?)";
        db.query(insertQuery, [username, password, realname, phonenumber, email], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ message: "Error creating user" });
            }

            console.log(`Successfully added new account ${username}`);

            // Now insert into the central users table
            const usersDefaultInsertQuery = "INSERT INTO users (username, email, source, registeredMethod, default_user_id) VALUES (?,?,?,?,?)";
            db.query(usersDefaultInsertQuery, [username, email, 'default', 'default', result.insertId], (err, result) => {
                if (err) {
                    console.error("Error inserting into users:", err);
                    return res.status(500).json({ message: "Error tracking user" });
                }

                console.log(`Successfully added user to central users table ${username} | ${email}`);


                const getUsersIDQuery = "SELECT * FROM users WHERE email = ?"
                db.query(getUsersIDQuery, [email], (err, idResult) => {
                    if (err) {
                        console.error("Error inserting into users:", err);
                        return res.status(500).json({ message: "Error tracking user" });
                    }

                    const user = idResult[0];
                    console.log(user)

                    // Creating JWT Token
                    const generatedToken = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: "3h" });
                    console.log(`${user.username} | ${user.email} | ${user.user_id} has successfully been added and logged in.`);
                    return res.status(200).json({ message: "User Added Successfully!", token: generatedToken });
                });

            });

        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Helper function to check if a value exists in the database for a given field
async function checkIfExists(field, value) {
    const query = `SELECT * FROM defaultUsers WHERE ${field} = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [value], (err, result) => {
            if (err) {
                console.error(`Error checking ${field}:`, err);
                reject(err);
            }
            resolve(result.length > 0); // Resolve true if value exists, false otherwise
        });
    });
}


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
                return res.status(409).json({ message: "Email Exists!" });
            }

            // Insert into googleUsers table
            const userGoogleInsertQuery = "INSERT INTO googleUsers (username, email, firstName, lastName, emailVerified) VALUES (?,?,?,?,?)";
            db.query(userGoogleInsertQuery, [name, email, firstName, lastName, emailVerified], (err, result) => {
                if (err) {
                    console.error("Error inserting user into googleUsers:", err);
                    return res.status(500).json({ message: "Error creating user" });
                }
                console.log(`Successfully added new Google account ${name} | ${email}`);

                // Now insert into the central users table
                const usersDefaultInsertQuery = "INSERT INTO users (username, email, source, registeredMethod, google_user_id) VALUES (?,?,?,?,?)";
                db.query(usersDefaultInsertQuery, [name, email, 'google', 'google', result.insertId], (err, result) => {
                    if (err) {
                        console.error("Error inserting into users:", err);
                        return res.status(500).json({ message: "Error tracking user" });
                    }

                    console.log(`Successfully added user to central users table ${name} | ${email}`);


                    const getUsersIDQuery = "SELECT * FROM users WHERE email = ?"
                    db.query(getUsersIDQuery, [email], (err, idResult) => {
                        if (err) {
                            console.error("Error inserting into users:", err);
                            return res.status(500).json({ message: "Error tracking user" });
                        }

                        const user = idResult[0];
                        console.log(user)

                        // Creating JWT Token
                        const generatedToken = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: "3h" });
                        console.log(`${user.username} | ${user.email} | ${user.user_id} has successfully been added and logged in.`);
                        return res.status(200).json({ message: "User Added Successfully!", token: generatedToken });
                    });

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

        const usernameCheckQuery = "SELECT * FROM users WHERE email = ?";
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
            const generatedToken = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: "3h" });
            console.log(`${user.username} | ${user.email} | ${user.user_id} has successfully logged in.`);
            return res.status(200).json({ token: generatedToken });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
