"use client";
import { useState } from "react";

export default function InvestorDashboard() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!symbol) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/${symbol.toUpperCase()}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard 📈</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-2 rounded w-60"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Fetching..." : "Get Data"}
        </button>
      </div>

      {data && (
        <div className="border rounded p-4 bg-gray-50 shadow-sm">
          <h2 className="text-lg font-semibold">{data.symbol}</h2>
          <p>💲 Current Price: {data.currentPrice} {data.currency}</p>
          <p>📈 Open: {data.open}</p>
          <p>📉 Previous Close: {data.previousClose}</p>
          <p>🔻 Day Low / High: {data.dayLow} - {data.dayHigh}</p>
        </div>
      )}
    </main>
  );
}
