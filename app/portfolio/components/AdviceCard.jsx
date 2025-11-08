"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export default function AdviceCard({ symbol, portfolioItem, stockData ,portfolioShare }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!portfolioItem || !stockData) return;


      try {
        const { data } = await axios.post("/api/ai/advice", {
          symbol,
          historicalData: stockData.history,     // ✅ use existing data
          portfolioShare,
          avgPrice: portfolioItem.avgPrice,
        });
        setAdvice(data?.aiAdvice || data);
      } catch (err) {
        console.error("Advice fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [symbol, portfolioItem, stockData]);

  if (loading)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">Getting AI advice...</p>
      </div>
    );

  if (!advice)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">No advice available for this stock.</p>
      </div>
    );

  const recommendationColor =
    advice.recommendation === "BUY"
      ? "text-green-600"
      : advice.recommendation === "SELL"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        AI Recommendation for {symbol}
      </h2>
      <p className={`text-2xl font-bold ${recommendationColor}`}>
        {advice.recommendation}
      </p>
      <p className="mt-2 text-gray-700">{advice.reason}</p>
      <p className="mt-2 text-sm text-gray-500">
        Suggested Allocation: {advice.suggestedAllocation}%
      </p>
    </div>
  );
}
