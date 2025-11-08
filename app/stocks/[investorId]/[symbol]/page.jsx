"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";
import AnalystStockNavbar from "../../components/AnalystStockNavBar";
import AnalystStockHeader from "../../components/AnalystStockheader";
import AnalystStockChart from "../../components/AnalystStockCharts";
import AnalystAdviceCard from "../../components/AnalystAdviceCard";
import AnalystChatBox from "../../components/AnalystChatBox";

export default function AnalystStockDetailsPage() {
  const { investorId, symbol } = useParams();
  const [investor, setInvestor] = useState(null);
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // ✅ 1. Fetch the analyst's assignments to find investor info
            const assignmentsRes = await axios.get("/api/assignments");
            const allAssignments = assignmentsRes.data || [];

            // find the one that matches this investor + symbol
            const currentAssignment = allAssignments.find(
            (a) =>
                a.investorId._id === investorId &&
                a.stocks.some((s) => s.toUpperCase() === symbol.toUpperCase()) &&
                a.status === "accepted"
            );

            if (!currentAssignment) {
            console.warn("No assignment found for this investor/stock.");
            setLoading(false);
            return;
            }

            // ✅ 2. Set investor info directly from assignment (populated field)
            setInvestor(currentAssignment.investorId);

            // ✅ 3. Fetch that investor's holdings securely
            const portfolioRes = await axios.get(
            `/api/assignments/portfolio?investorId=${investorId}&symbol=${symbol}`
            );
            const holdings = portfolioRes.data?.holdings || [];

            // ✅ 4. Find the relevant stock
            const foundStock = holdings.find(
            (item) => item.symbol.toUpperCase() === symbol.toUpperCase()
            );
            setPortfolioItem(foundStock || null);

            // ✅ 5. Fetch stock data from Yahoo (your existing route)
            const stockRes = await axios.get(`/api/stocks/${symbol}`);
            setStockData(stockRes.data);
        } catch (err) {
            console.error("Error fetching analyst stock data:", err);
        } finally {
            setLoading(false);
        }
        };


    if (investorId && symbol) fetchData();
  }, [investorId, symbol]);

  if (loading) return <div className="p-8 text-gray-500">Loading data...</div>;
  if (!stockData)
    return (
      <div className="p-8 text-gray-500">No data found for {symbol}.</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <AnalystStockNavbar investor={investor} />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* 🔹 GRID WRAPPER — aligns both top & bottom sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✳️ LEFT SIDE (2 columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Header */}
            <div className="mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Investor Portfolio Snapshot
              </h2>
              <p className="text-sm text-gray-500">
                A detailed overview of {investor?.name} holding in {symbol},
                along with live market data and AI-backed analysis.
              </p>
            </div>

            <AnalystStockHeader
              symbol={symbol}
              investor={investor}
              portfolioItem={portfolioItem}
            />

            {/* ✳️ Chart Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Market Movement
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Study {symbol}’s technical trends, price range, and volume
                behavior over time.
              </p>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <AnalystStockChart stockData={stockData} investor={investor} />
              </div>
            </div>
          </div>

          {/* ✳️ RIGHT SIDE (1 column wide) */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                AI Market Insight
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Here’s what our model suggests about {symbol}’s technical
                direction and market structure.
              </p>
              <AnalystAdviceCard
                symbol={symbol}
                stockData={stockData}
                investor={investor}
              />
            </div>
          </div>
        </div>

        {/* 🔹 SECOND GRID ROW — CHATBOX */}
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
                Analyst Discussion Assistant
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Use this chat to reason through {symbol}’s trends, investor risk
                exposure, or validate AI signals with your expertise.
              </p>

              <AnalystChatBox
                symbol={symbol}
                investor={investor}
                stockData={stockData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
