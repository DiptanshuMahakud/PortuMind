"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import AnalystNavbar from "../components/AnalystNavbar";
import toast from "react-hot-toast";

export default function AnalystRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("/api/assignments");
      const requests = data.filter((a) => a.status === "pending");
      setPending(requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (investorId, symbol, action) => {
    try {
      const { data } = await axios.post("/api/assignments/respond", {
        investorId,
        symbol,
        action,
      });
      toast.success(data.message);
      fetchRequests(); // refresh
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <AnalystNavbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Pending Requests
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading requests...</p>
        ) : pending.length === 0 ? (
          <p className="text-gray-500">No pending requests at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pending.map((a) => (
              <div
                key={a._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
              >
                <p className="font-medium text-gray-800">
                  Investor: {a.investorId.name}
                </p>
                <p className="text-sm text-gray-500 mb-4">
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
      </div>
    </div>
  );
}
