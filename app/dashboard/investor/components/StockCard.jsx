"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";

export default function StockCard({ stock }) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await axios.get(`/api/stocks/${stock.symbol}`);
        setLiveData(res.data);
      } catch (err) {
        console.error(`Error fetching live data for ${stock.symbol}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, [stock.symbol]);

  // 🦴 Skeleton Loader Component
  if (loading) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse">
        <div className="flex justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-10"></div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // 🧮 Actual Stock Data
  const currentPrice = liveData?.currentPrice || 0;
  const avgPrice = stock.avgPrice;
  const gainLoss = ((currentPrice - avgPrice) / avgPrice) * 100;
  const isProfit = gainLoss > 0;
  const totalValue = (currentPrice * stock.quantity).toFixed(2);

  return (
    <div
      className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition"
      onClick={() => (window.location.href = `/portfolio/${stock.symbol}`)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{stock.symbol}</h3>
        <span
          className={`text-sm font-semibold ${
            isProfit ? "text-green-600" : "text-red-500"
          }`}
        >
          {isProfit ? "+" : ""}
          {gainLoss.toFixed(2)}%
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <p>
          Avg Price: <span className="font-medium">${avgPrice}</span>
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

      <div className="mt-2 text-sm text-gray-600">
        <p>
          Holding: {stock.quantity} shares →{" "}
          <span className="font-semibold text-gray-800">${totalValue}</span>
        </p>
      </div>
    </div>
  );
}
