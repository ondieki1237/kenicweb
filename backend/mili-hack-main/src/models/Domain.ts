import mongoose, { Document, Schema } from "mongoose";

export interface IDomain extends Document {
  name: string;
  available: boolean;
  registrar?: string;
  pricing?: number[];
  whoisData?: any;
  owner?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const domainSchema = new Schema<IDomain>({
  name: { type: String, required: true },
  available: { type: Boolean, required: true },
  registrar: { type: String },
  pricing: { type: [Number] },
  whoisData: { type: Schema.Types.Mixed },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model<IDomain>("Domain", domainSchema);
