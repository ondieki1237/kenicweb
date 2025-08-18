import mongoose, { Connection } from "mongoose";

const MONGODB_URI_KENIC = process.env.MONGODB_URI_KENIC;

if (!MONGODB_URI_KENIC) {
  throw new Error("Please define the MONGODB_URI_KENIC environment variable");
}

export let kenicConnection: Connection;

export const connectKenicDB = async () => {
  try {
    kenicConnection = await mongoose.createConnection(MONGODB_URI_KENIC, {
      dbName: "kenic_db", // Explicitly specify database name
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB Kenic connected");
    return kenicConnection;
  } catch (error) {
    console.error("❌ MongoDB Kenic connection failed:", error);
    process.exit(1);
  }
};