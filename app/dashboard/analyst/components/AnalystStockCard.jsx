"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export default function AnalystStockCard({ assignment }) {
  const investor = assignment.investorId;
  const symbol = assignment.stocks[0];

  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await axios.get(`/api/stocks/${symbol}`);
        setLiveData(res.data);
      } catch (err) {
        console.error(`Error fetching live data for ${symbol}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, [symbol]);

  if (loading)
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <p className="text-gray-400">Loading {symbol}...</p>
      </div>
    );

  // --- compute data like the investor card
  const currentPrice = liveData?.currentPrice || 0;
  const avgPrice = liveData?.previousClose || 0; // analyst may not have investor's avg, fallback
  const gainLoss = ((currentPrice - avgPrice) / avgPrice) * 100 || 0;
  const isProfit = gainLoss > 0;

  return (
    <div
      className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={() =>
        (window.location.href = `/stocks/${investor._id}/${symbol}`)
      }
    >
      {/* Investor Info */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Investor:
            <span className="ml-1 text-blue-700 font-semibold">
              {investor.name}
            </span>
          </h3>
          <p className="text-xs text-gray-400">{investor.email}</p>
        </div>
      </div>

      {/* Stock Header */}
      <div className="flex justify-between items-center mb-2 mt-1">
        <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
        <span
          className={`text-sm font-semibold ${
            isProfit ? "text-green-600" : "text-red-500"
          }`}
        >
          {isProfit ? "+" : ""}
          {gainLoss.toFixed(2)}%
        </span>
      </div>

      {/* Price Info */}
      <div className="flex justify-between text-sm text-gray-600">
        <p>
          Prev Close:{" "}
          <span className="font-medium">${avgPrice.toFixed(2)}</span>
        </p>
        <p>
          Current:{" "}
          <span
            className={`font-semibold ${
              isProfit ? "text-green-600" : "text-red-500"
            }`}
          >
            ${currentPrice.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-2 text-xs text-gray-500 italic">
        Click to analyze {symbol} for {investor.name}
      </div>
    </div>
  );
}
