import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import betRoutes from "./routes/betRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/log", logRoutes)

// Connect to Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log(`Connected to MySQL database || ${process.env.DB_HOST}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
