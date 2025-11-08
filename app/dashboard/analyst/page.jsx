"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";

export default function AnalystDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get("/api/assignments");
        setAssignments(data || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleRespond = async (investorId, symbol, action) => {
    try {
      const { data } = await axios.post("/api/assignments/respond", {
        investorId,
        symbol,
        action,
      });
      toast.success(data.message);
      setAssignments((prev) =>
        prev.map((a) =>
          a.investorId._id === investorId && a.stocks.includes(symbol)
            ? { ...a, status: action === "accept" ? "accepted" : "declined" }
            : a
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading assignments...
      </div>
    );

  const pending = assignments.filter((a) => a.status === "pending");
  const active = assignments.filter((a) => a.status === "accepted");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">
          Analyst Dashboard
        </h2>

        {/* Pending Requests */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Pending Requests
          </h3>
          {pending.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pending.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <p className="text-gray-800 font-medium">
                    Investor: {a.investorId.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Stock: {a.stocks.join(", ")}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleRespond(a.investorId._id, a.stocks[0], "accept")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRespond(a.investorId._id, a.stocks[0], "decline")
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Assignments */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Active Assignments
          </h3>
          {active.length === 0 ? (
            <p className="text-gray-500 text-sm">No active assignments yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {active.map((a) => (
                <div
                  key={a._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <p className="text-gray-800 font-medium">
                    Investor: {a.investorId.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Stocks: {a.stocks.join(", ")}
                  </p>
                  <p className="text-green-600 font-semibold text-sm">
                    Accepted ✅
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
