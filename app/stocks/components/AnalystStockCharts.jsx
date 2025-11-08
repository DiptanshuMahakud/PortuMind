"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AnalystStockChart({ stockData, investor }) {
  const [selectedChart, setSelectedChart] = useState("price");
  const history = stockData?.history || [];

  const formattedData = history.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    open: d.open,
    close: d.close,
    high: d.high,
    low: d.low,
    volume: d.volume || 0,
  }));

  const yDomain = ["dataMin - 5", "dataMax + 5"];

  const renderChart = () => {
    switch (selectedChart) {
      case "price":
        return (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0070f3" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#0070f3" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis domain={yDomain} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#0070f3"
              fill="url(#priceGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "openClose":
        return (
          <LineChart data={formattedData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis domain={yDomain} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#22c55e"
              strokeWidth={2}
              name="Open"
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#ef4444"
              strokeWidth={2}
              name="Close"
            />
          </LineChart>
        );

      case "range":
        return (
          <ComposedChart data={formattedData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis domain={yDomain} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#facc15"
              fill="#fde68a"
              fillOpacity={0.4}
              name="High"
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#3b82f6"
              fill="#bfdbfe"
              fillOpacity={0.4}
              name="Low"
            />
          </ComposedChart>
        );

      case "volume":
        return (
          <BarChart data={formattedData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip />
            <Bar dataKey="volume" fill="#60a5fa" barSize={20} />
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            {stockData.symbol} — Technical Overview
          </h2>
          {investor && (
            <p className="text-sm text-gray-500">
              Analyzing on behalf of{" "}
              <span className="font-semibold text-blue-600">
                {investor.name}
              </span>
            </p>
          )}
        </div>

        <select
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="price">Price (Close)</option>
          <option value="openClose">Open vs Close</option>
          <option value="range">High–Low Range</option>
          <option value="volume">Volume</option>
        </select>
      </div>

      <div className="h-[450px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
