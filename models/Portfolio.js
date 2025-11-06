import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  holdings: [
    {
      symbol: String,
      quantity: Number,
      avgPrice: Number,
    },
  ],
});

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);
