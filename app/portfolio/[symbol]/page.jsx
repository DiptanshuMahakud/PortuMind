"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";
import StockNavbar from "../components/StockNavbar";
import StockHeader from "../components/StockHeader";
import StockChart from "../components/StockCharts";
import AdviceCard from "../components/AdviceCard";
import ChatBox from "../components/StockChat";
import AssignAnalystCard from "../components/AnalystAssignCard";

export default function StockDetailsPage() {
  const { symbol } = useParams();
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [portfolioShare, setPortfolioShare] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch investor portfolio
        const portfolioRes = await axios.get("/api/portfolio");
        const holdings = portfolioRes.data?.portfolio?.holdings || [];

        // ✅ Fetch live + historical stock data
        const stockRes = await axios.get(`/api/stocks/${symbol}`);
        const stockInfo = stockRes.data;

        // ✅ Find current stock in holdings
        const foundStock = holdings.find(
          (item) => item.symbol.toUpperCase() === symbol.toUpperCase()
        );
        setPortfolioItem(foundStock || null);
        setStockData(stockInfo);

        if (holdings.length > 0 && foundStock) {
            // ✅ Make a single bulk API call
            const symbols = holdings.map((h) => h.symbol);
            const bulkRes = await axios.post("/api/stocks/bulk", { symbols });
            const prices = bulkRes.data?.prices || [];

            // ✅ Create a quick lookup table
            const priceMap = {};
            prices.forEach((p) => (priceMap[p.symbol] = p.currentPrice));

            // ✅ Compute total portfolio value
            const totalValue = holdings.reduce((sum, h) => {
                const symbolKey = h.symbol?.toUpperCase();
                const price = Number(priceMap[symbolKey]) || Number(h.avgPrice) || 0;
                const quantity = Number(h.quantity) || 0;
                const stockValue = price * quantity;

                if (isNaN(stockValue)) {
                    console.warn(`⚠️ Invalid value for ${h.symbol}:`, {
                    price,
                    quantity,
                    avgPrice: h.avgPrice,
                    });
                    return sum;
                }

                return sum + stockValue;
            }, 0);


            // ✅ Compute this stock’s allocation
            const currentPrice = priceMap[symbol] || foundStock.avgPrice;
            const thisValue = currentPrice * foundStock.quantity;
            const allocation = (thisValue / totalValue) * 100;
            console.log("🧮 totalValue:", totalValue, "thisValue:", thisValue, "currentPrice:", currentPrice);
            console.log("💰 priceMap:", priceMap);

            setPortfolioShare(allocation.toFixed(2));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) fetchData();
  }, [symbol]);

  if (loading) return <div className="p-8 text-gray-500">Loading data...</div>;
  if (!stockData)
    return <div className="p-8 text-gray-500">Stock data not found.</div>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <StockNavbar />

    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* 🔹 GRID WRAPPER — aligns both top & bottom sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ✳️ LEFT SIDE (2 columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Header */}
          <div className="mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              My Portfolio Snapshot
            </h2>
            <p className="text-sm text-gray-500">
              A quick overview of your current holding and how it’s performing in real-time.
            </p>
          </div>

          <StockHeader
            symbol={symbol}
            portfolioItem={portfolioItem}
            portfolioShare={portfolioShare}
          />

          {/* ✳️ Chart Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Market Movement
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Track {symbol}’s price action and technical trends over the past few weeks.
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <StockChart stockData={stockData} />
            </div>
          </div>
        </div>

        {/* ✳️ RIGHT SIDE (1 column wide) */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              AI Investment Insight
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Based on recent performance and your portfolio allocation, here’s what our model suggests for {symbol}.
            </p>
            <AdviceCard
              symbol={symbol}
              portfolioItem={portfolioItem}
              stockData={stockData}
              portfolioShare={portfolioShare}
            />
          </div>

          <AssignAnalystCard symbol={symbol} />
        </div>
      </div>

      {/* 🔹 SECOND GRID ROW — CHATBOX (aligned with left side start) */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <div
            className="
              bg-white/90
              border border-gray-100
              rounded-2xl
              shadow-md
              p-6 md:p-8
              backdrop-blur-sm
              transition-all
              duration-300
              hover:shadow-lg
            "
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Talk to Your AI Analyst
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Discuss strategies, clarify AI reasoning, or explore how {symbol} fits into your long-term portfolio goals.
            </p>

            {/* ✅ FIX: Remove overflow-hidden to prevent input cut-off */}
            <ChatBox
                symbol={symbol}
                portfolioItem={portfolioItem}
                stockData={stockData}
                portfolioShare={portfolioShare}
              />
          </div>
        </div>

        {/* Empty right column for alignment */}
        <div></div>
      </div>
    </div>
  </div>
);

}
