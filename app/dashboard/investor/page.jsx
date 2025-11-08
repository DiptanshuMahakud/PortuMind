"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import Navbar from "./components/NavBar";
import PortfolioGrid from "./components/StockGrid";
import ImportButton from "./components/ImportCSVButton";
import { useRouter } from "next/navigation";

export default function InvestorDashboard() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const fetchPortfolio = async () => {
    try {
      const res = await axios.get("/api/portfolio");
      const data = res.data;
      // ✅ Case 1: If backend sent unauthorized (no cookie / invalid token)
      if (res.status === 401 || data.error === "Unauthorized") {
        console.warn("User not authorized, redirecting to login...");
        router.push("/login");
        return;
      }

      // ✅ Case 2: Portfolio exists but is empty
      if (!data || !data.portfolio || !data.portfolio.holdings?.length) {
        setHoldings([]);
        return;
      }

      // ✅ Case 3: Portfolio data available
      setHoldings(data.portfolio.holdings || []);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
      // Handle token-expiry cases too
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchPortfolio();
}, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    {/* Navbar */}
    <Navbar />

    {/* Page Container */}
    <div className="max-w-6xl mx-auto px-6 py-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-blue-700 tracking-tight">
            My Investment Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            A snapshot of your portfolio’s heartbeat — view, analyze, and expand your holdings in real time.
          </p>
        </div>

        {/* Import Button (right side on desktop, top on mobile) */}
        <div className="flex justify-start md:justify-end">
          <ImportButton onUploadSuccess={setHoldings} />
        </div>
      </div>

      {/* ✳️ Intro Section */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white/90 via-blue-50/40 to-white/80 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        {/* Decorative Gradient Accent Bar */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-300 rounded-l-2xl" />

        {/* Content */}
        <div className="pl-4">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            Welcome back, <span className="text-blue-600">Investor</span> 👋
          </h3>

          <p className="text-gray-600 text-[15px] leading-relaxed max-w-3xl">
            Here you’ll find an overview of all the stocks you currently hold.
            Each card represents a live position in your portfolio — showing its
            average buy-in and performance trend.{" "}
            <br className="hidden sm:block" />
            As you grow your investments, use this dashboard to monitor allocation,
            identify outperformers, and spot opportunities for rebalancing.
          </p>
        </div>
    </div>


      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-base">Loading portfolio...</p>
          </div>
        ) : !Array.isArray(holdings) || holdings.length === 0 ? (
          // ✅ Safe check
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
            <p className="text-lg font-medium">No stocks imported yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Use the{" "}
              <span className="text-blue-600 font-semibold">Import Stocks</span>{" "}
              button to upload your holdings CSV or add them manually.
            </p>
          </div>
        ) : (
          <>
            {/* ✳️ Section intro */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                Current Holdings
              </h3>
              <p className="text-sm text-gray-500">
                Below is your live portfolio overview — click any stock to
                access in-depth charts, AI insights, and personalized analysis.
              </p>
            </div>

            <PortfolioGrid holdings={holdings} />
          </>
        )}
      </div>

      {/* ✳️ Subtle footer tagline */}
      <div className="text-center text-gray-400 text-xs mt-12">
        Empowering smarter investing — one insight at a time.
      </div>
    </div>
  </div>
);

}
