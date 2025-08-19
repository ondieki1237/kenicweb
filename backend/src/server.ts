import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import connectDB from "./config/db";
import { connectKenicDB } from "./lib/mongokenic";
import authRoutes from "./routes/authRoutes";
import domainRoutes from "./routes/domainRoutes";
import cors from "cors";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);

// Connect to MongoDB
connectKenicDB().then(() => console.log("✅ Connected to MongoDB Kenic"));
connectDB(); // main DB

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
