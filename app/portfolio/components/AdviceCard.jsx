"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

function LoadingText() {
  const messages = [
    "Fetching market data...",
    "Analyzing performance trends...",
    "Evaluating your portfolio...",
    "Generating AI recommendation...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <p className="text-gray-600 text-sm sm:text-base font-medium transition-all duration-500 ease-in-out">
      {messages[index]}
    </p>
  );
}

export default function AdviceCard({ symbol, portfolioItem, stockData ,portfolioShare }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAdvice = async () => {
    if (!portfolioItem || !stockData) return;

    try {
      const { data } = await axios.post("/api/ai/advice", {
        symbol,
        historicalData: stockData.history,
        portfolioShare,
        avgPrice: portfolioItem.avgPrice,
      });

      const aiAdvice = data?.aiAdvice || data;
      setAdvice(aiAdvice);

      // ✅ Save AI report automatically
      await axios.post("/api/reports", {
        symbol,
        aiSummary: aiAdvice.reason,
        aiRecommendation: aiAdvice.recommendation,
        suggestedAllocation: aiAdvice.suggestedAllocation,
      });
    } catch (err) {
      console.error("Advice fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAdvice();
}, [symbol, portfolioItem, stockData, portfolioShare]);

if (loading)
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md flex flex-col items-center justify-center text-center p-10 min-h-[220px]">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5"></div>

      {/* Dynamic Loading Text */}
      <LoadingText />

      <p className="text-gray-400 text-xs mt-3 tracking-wide">
        PortuMind AI is processing...
      </p>
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
