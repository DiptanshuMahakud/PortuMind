"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AnalystNavbar from "./components/AnalystNavbar";
import AnalystStockCard from "./components/AnalystStockCard";

export default function AnalystDashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Role Guard — ensure only analyst can access
  useEffect(() => {
    const verifyRole = async () => {
      try {
        const { data } = await axios.get("/api/verify");
        if (data.role !== "analyst") {
          toast.error("Not an analyst — please log in again");
          router.push("/login");
        }
      } catch (err) {
        toast.error("Session expired — please log in again");
        router.push("/login");
      }
    };
    verifyRole();
  }, [router]);

  // ✅ Fetch accepted assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get("/api/assignments");
        const active = data.filter((a) => a.status === "accepted");
        setAssignments(active);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <AnalystNavbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Stocks Assigned to You
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500">No accepted assignments yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {assignments.map((a) => (
              <AnalystStockCard key={a._id} assignment={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
