import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  aiSummary: String,
  aiRecommendation: String,
  suggestedAllocation: Number,
  chatHistory: [{ role: String, message: String }], // optional for chat logs
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
