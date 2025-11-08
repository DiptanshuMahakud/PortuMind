"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";
import StockNavbar from "../components/StockNavbar";
import StockHeader from "../components/StockHeader";
import StockChart from "../components/StockCharts";
import AdviceCard from "../components/AdviceCard";
import ChatBox from "../components/StockChat";

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
  <div className="min-h-screen bg-gray-50">
    <StockNavbar />

    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
      {/* 🔹 LEFT SIDE — Portfolio + Chart */}
      <div className="flex-1 lg:w-3/5 space-y-6">
        {/* ✳️ Section Header */}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <StockChart stockData={stockData} />
          </div>
        </div>
      </div>

      {/* 🔹 RIGHT SIDE — Advice + Chat */}
      <div className="lg:w-2/5 flex flex-col space-y-6">
        {/* ✳️ Advice Section */}
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

        {/* ✳️ Chat Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Talk to Your AI Analyst
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Discuss strategy, clarify the reasoning behind AI’s call, or ask how {symbol} fits into your long-term plan.
          </p>
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[520px] flex flex-col">
            <ChatBox
              symbol={symbol}
              portfolioItem={portfolioItem}
              stockData={stockData}
              portfolioShare={portfolioShare}
            />
          </div> */}
          <ChatBox
              symbol={symbol}
              portfolioItem={portfolioItem}
              stockData={stockData}
              portfolioShare={portfolioShare}
            />
        </div>
      </div>
    </div>
  </div>
);

}
