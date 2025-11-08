"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export default function AnalystAdviceCard({ symbol, stockData, investor }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!stockData) return;

      try {
        const { data } = await axios.post("/api/ai/advice", {
          symbol,
          historicalData: stockData.history,
        });
        setAnalysis(data?.aiAdvice || data);
      } catch (err) {
        console.error("AI analysis fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol, stockData]);

  if (loading)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">Generating AI analysis...</p>
      </div>
    );

  if (!analysis)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">No insights available for this stock.</p>
      </div>
    );

  const recommendationColor =
    analysis.recommendation === "BUY"
      ? "text-green-600"
      : analysis.recommendation === "SELL"
      ? "text-red-500"
      : "text-yellow-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        AI Market Insight — {symbol}
      </h2>

      {investor && (
        <p className="text-sm text-gray-500 mb-3">
          For investor:{" "}
          <span className="font-semibold text-blue-600">{investor.name}</span>
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <p className={`text-xl font-bold ${recommendationColor}`}>
          {analysis.recommendation}
        </p>
        <span className="text-sm text-gray-400 uppercase tracking-wide">
          Recommendation
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{analysis.reason}</p>

      {analysis.suggestedAllocation && (
        <p className="text-sm text-gray-500 italic">
          Suggested Portfolio Weight:{" "}
          <span className="font-medium text-gray-800">
            {analysis.suggestedAllocation}%
          </span>
        </p>
      )}

      <div className="mt-5 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <p>
          ⚙️ Analyst Note: Use these insights to form your technical or
          fundamental evaluation for {symbol}. This is model-based reasoning and
          should be interpreted critically.
        </p>
      </div>
    </div>
  );
}
