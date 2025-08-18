import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { connectKenicDB } from "./lib/mongokenic";
import authRoutes from "./routes/authRoutes";
import domainRoutes from "./routes/domainRoutes";

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow Next.js frontend
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);

// Connect to MongoDB
async function startDatabases() {
  try {
    await connectKenicDB(); // Connect to kenic_db for auth
    console.log("✅ MongoDB Kenic connection established");
    await connectDB(); // Connect to news_db for other operations
    console.log("✅ MongoDB Main connection established");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

startDatabases();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));