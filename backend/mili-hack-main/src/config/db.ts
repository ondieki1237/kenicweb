import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }
    await mongoose.connect(uri, {
      dbName: "news_db", // Explicitly specify database name
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB Main connected");
  } catch (error) {
    console.error("❌ MongoDB Main connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;