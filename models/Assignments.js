import mongoose from "mongoose";
import "./User";
const AssignmentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  analystId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stocks: [{ type: String }], // e.g., ["AAPL", "TSLA"]
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
