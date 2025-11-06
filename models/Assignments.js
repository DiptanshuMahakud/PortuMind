import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  analystId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stocks: [{ type: String }], // symbols like ["AAPL", "TSLA"]
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
