"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalystStockHeader({ symbol, investor, portfolioItem }) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await axios.get(`/api/stocks/${symbol}`);
        setLiveData(res.data);
      } catch (err) {
        console.error("Error fetching live data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (symbol) fetchLiveData();
  }, [symbol]);

  if (loading)
    return (
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <p className="text-gray-500">Loading {symbol} data...</p>
      </div>
    );

  // --- Analyst context note ---
  if (!portfolioItem)
    return (
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">
          No specific portfolio data available for {investor?.name || "Investor"}.
        </h2>
      </div>
    );

  // --- Calculations ---
  const currentPrice = liveData?.currentPrice || 0;
  const avgPrice = portfolioItem.avgPrice;
  const quantity = portfolioItem.quantity;
  const gainLoss = ((currentPrice - avgPrice) / avgPrice) * 100;
  const totalValue = currentPrice * quantity;
  const totalGainLoss = (currentPrice - avgPrice) * quantity;
  const isProfit = gainLoss >= 0;

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {symbol}
          </h1>
          <p className="text-sm text-gray-500">
            Investor’s Portfolio Position
          </p>
          {investor && (
            <p className="text-xs text-blue-600 mt-1">
              Analyzing for <span className="font-semibold">{investor.name}</span>{" "}
              ({investor.email})
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center text-lg font-semibold ${
              isProfit ? "text-green-600" : "text-red-500"
            }`}
          >
            {isProfit ? (
              <ArrowUpRight size={18} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={18} strokeWidth={2.5} />
            )}
            {gainLoss.toFixed(2)}%
          </span>
        </div>

        {/* Analyst context */}
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-500">Analyzing As</p>
          <p className="text-blue-600 font-semibold text-lg">Analyst</p>
        </div>
      </div>

      {/* Sub Info Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-gray-700">
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="text-lg font-semibold">{quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Price</p>
          <p className="text-lg font-semibold">${avgPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p
            className={`text-lg font-semibold ${
              isProfit ? "text-green-600" : "text-red-500"
            }`}
          >
            ${currentPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="text-lg font-semibold">${totalValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            Net {isProfit ? "Profit" : "Loss"}
          </p>
          <p
            className={`text-lg font-semibold ${
              isProfit ? "text-green-600" : "text-red-500"
            }`}
          >
            {isProfit ? "+" : "-"}${Math.abs(totalGainLoss).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Currency</p>
          <p className="text-lg font-semibold">
            {liveData?.currency || "USD"}
          </p>
        </div>
      </div>

      {/* Market Info Section */}
      <div className="flex flex-wrap gap-6 mt-8 text-gray-600 text-sm">
        <p>
          <span className="text-gray-400">Day High:</span>{" "}
          <span className="font-medium">${liveData?.dayHigh?.toFixed(2)}</span>
        </p>
        <p>
          <span className="text-gray-400">Day Low:</span>{" "}
          <span className="font-medium">${liveData?.dayLow?.toFixed(2)}</span>
        </p>
        <p>
          <span className="text-gray-400">Prev Close:</span>{" "}
          <span className="font-medium">
            ${liveData?.previousClose?.toFixed(2)}
          </span>
        </p>
        <p>
          <span className="text-gray-400">Open:</span>{" "}
          <span className="font-medium">${liveData?.open?.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
