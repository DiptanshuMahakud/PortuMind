"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import toast from "react-hot-toast";

export default function AssignAnalystCard({ symbol }) {
  const [analyst, setAnalyst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ Check if analyst is already assigned for this stock
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(`/api/assignments/check?symbol=${symbol}`);
        if (data?.assigned) setAnalyst(data);
      } catch (err) {
        console.error("Error checking assignment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [symbol]);

  // ✅ Handle sending request
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter an analyst's email first.");
    setSending(true);
    try {
      const { data } = await axios.post("/api/assignments/request", {
        analystEmail: email,
        symbol,
      });
      toast.success(data.message || "Request sent!");
      setAnalyst({
        assigned: false,
        status: "pending",
        analyst: { email },
      });
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <p className="text-gray-500 text-sm">Checking analyst assignment...</p>
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      {analyst?.analyst ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Assigned Analyst
          </h3>
          <p className="text-gray-700 text-sm">
            <span className="font-medium">{analyst.analyst.name || "Unnamed Analyst"}</span>{" "}
            ({analyst.analyst.email})
          </p>

          <div className="mt-2">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                analyst.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : analyst.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {analyst.status === "accepted"
                ? "Accepted"
                : analyst.status === "pending"
                ? "Pending"
                : "Declined"}
            </span>
          </div>

          {analyst.status === "pending" && (
            <p className="text-xs text-gray-400 mt-3 italic">
              Waiting for analyst to accept the request.
            </p>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Assign an Analyst
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter the email of the analyst you would like to assign for{" "}
            <span className="font-semibold text-blue-600">{symbol}</span>.
          </p>

          <form onSubmit={handleAssign} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="analyst@example.com"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
