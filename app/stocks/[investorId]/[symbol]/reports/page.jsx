"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { ArrowLeft, CheckCircle, XCircle, RefreshCcw, Clock } from "lucide-react";

export default function ReportsHistoryPage() {
  const { investorId, symbol } = useParams();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(
          `/api/reports?investorId=${investorId}&symbol=${symbol}`
        );
        setReports(data.reports || []);
      } catch (err) {
        console.error("Error fetching report history:", err);
      } finally {
        setLoading(false);
      }
    };
    if (investorId && symbol) fetchReports();
  }, [investorId, symbol]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading report history...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Report History — {symbol}
          </h1>
          <p className="text-sm text-gray-500">
            All AI analyses and reviews for this investor’s {symbol} holdings.
          </p>
        </div>
        <button
          onClick={() => router.push(`/stocks/${investorId}/${symbol}`)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={18} /> Back to Analysis
        </button>
      </div>

      {/* Reports list */}
      <div className="max-w-6xl mx-auto space-y-6">
        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-gray-500">
            No reports available for {symbol}.
          </div>
        ) : (
          reports.map((r, idx) => (
            <div
              key={r._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">Report #{reports.length - idx}</p>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {r.aiRecommendation} — {symbol}
                  </h2>
                </div>

                {/* Status Badge */}
                <StatusBadge status={r.approvalStatus} />
              </div>

              {/* AI Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  AI Summary
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.aiSummary || "—"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <p>
                  <span className="text-gray-500">Recommendation:</span>{" "}
                  <span className="font-semibold">{r.aiRecommendation}</span>
                </p>
                <p>
                  <span className="text-gray-500">Suggested Allocation:</span>{" "}
                  <span className="font-semibold">{r.suggestedAllocation}%</span>
                </p>
                <p>
                  <span className="text-gray-500">Created At:</span>{" "}
                  <span className="font-semibold">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Analyst Section */}
              <div className="border-t pt-3 mt-3">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Analyst Review
                </h3>
                {r.analystId ? (
                  <div className="text-sm text-gray-600">
                    <p>
                      Reviewed by:{" "}
                      <span className="font-semibold text-blue-700">
                        {r.analystId.name || "Analyst"}
                      </span>
                    </p>
                    <p className="mt-1 italic text-gray-500">
                      {r.analystNote || "No note provided"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Not yet reviewed by any analyst.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* 🔹 Helper component for status badge */
function StatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-600";
  let icon = <Clock size={14} />;

  switch (status) {
    case "Approved":
      color = "bg-green-100 text-green-700";
      icon = <CheckCircle size={14} />;
      break;
    case "Rejected":
      color = "bg-red-100 text-red-600";
      icon = <XCircle size={14} />;
      break;
    case "Reanalyze":
      color = "bg-yellow-100 text-yellow-700";
      icon = <RefreshCcw size={14} />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {icon} {status || "Pending"}
    </span>
  );
}
