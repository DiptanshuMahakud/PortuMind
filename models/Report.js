import mongoose from "mongoose";
import "./User";
const ReportSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  analystId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // filled when analyst reviews
  },
  symbol: {
    type: String,
    required: true,
  },

  // --- AI-generated data (investor side) ---
  aiSummary: String, // general analysis or description
  aiRecommendation: String, // BUY / SELL / HOLD
  suggestedAllocation: Number,

  // --- Conversation logs ---
  chatHistory: [
    {
      role: String, // "user" or "model"
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],

  // --- Analyst review fields ---
  analystNote: {
    type: String,
    default: "",
  },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Reanalyze"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
