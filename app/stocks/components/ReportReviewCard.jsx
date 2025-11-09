"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReportReviewCard({ investor, symbol }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analystNote, setAnalystNote] = useState("");

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const { data } = await axios.get(
          `/api/reports?investorId=${investor?._id}&symbol=${symbol}`
        );
        const reports = data?.reports || [];
        if (reports.length > 0) {
          // latest report = first since sorted desc by createdAt
          setReport(reports[0]);
          setAnalystNote(reports[0].analystNote || "");
        }
      } catch (err) {
        console.error("Error fetching latest report:", err);
      } finally {
        setLoading(false);
      }
    };
    if (investor && symbol) fetchLatestReport();
  }, [investor, symbol]);

  const handleAction = async (status) => {
    try {
      await axios.patch(`/api/reports/${report._id}`, {
        analystNote,
        approvalStatus: status,
      });
      toast.success(`Report marked as ${status}`);
      setReport({ ...report, approvalStatus: status, analystNote });
    } catch (err) {
      toast.error("Failed to update report");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">Loading latest report...</p>
      </div>
    );

  if (!report)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500">
          No reports yet for {symbol}. The investor hasn’t generated any AI analysis.
        </p>
      </div>
    );

  const colorMap = {
    BUY: "text-green-600",
    SELL: "text-red-500",
    HOLD: "text-yellow-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Latest AI Report for {symbol}
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">
          Recommendation:
          <span
            className={`ml-1 font-semibold ${
              colorMap[report.aiRecommendation] || "text-gray-700"
            }`}
          >
            {report.aiRecommendation}
          </span>
        </p>
        <p className="text-sm text-gray-500 mb-1">
          Suggested Allocation:{" "}
          <span className="font-semibold text-gray-800">
            {report.suggestedAllocation}%
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {report.aiSummary}
        </p>
      </div>

      {/* Analyst Note */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Analysis / Note
        </label>
        <textarea
          value={analystNote}
          onChange={(e) => setAnalystNote(e.target.value)}
          placeholder="Write your assessment or remarks here..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("Approved")}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <CheckCircle size={16} /> Approve
        </button>
        <button
          onClick={() => handleAction("Rejected")}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <XCircle size={16} /> Reject
        </button>
        <button
          onClick={() => handleAction("Reanalyze")}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <RefreshCcw size={16} /> Reanalyze
        </button>
      </div>

      {/* Status display */}
      {report.approvalStatus && (
        <p className="text-sm text-gray-500 mt-3">
          Current Status:{" "}
          <span className="font-medium text-blue-700">
            {report.approvalStatus}
          </span>
        </p>
      )}
    </div>
  );
}
