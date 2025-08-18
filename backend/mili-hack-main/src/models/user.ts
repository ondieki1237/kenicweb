// models/User.js
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: "user" | "admin";
  company?: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String }, // Optional, as per auth.ts User interface
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    company: { type: String }, // Optional, as per auth.ts User interface
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);