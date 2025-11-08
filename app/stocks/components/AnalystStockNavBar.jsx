"use client";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import axios from "@/utils/axios";
import toast from "react-hot-toast";

export default function AnalystStockNavbar({ investor }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand & Back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/analyst")}
            className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div
            onClick={() => router.push("/dashboard/analyst")}
            className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition"
          >
            InvestIQ Analyst
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-6 text-gray-700">
          <button
            onClick={() => router.push("/dashboard/analyst")}
            className="hover:text-blue-600 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/dashboard/analyst/request")}
            className="hover:text-blue-600 transition"
          >
            Requests
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Optional investor info banner */}
      {investor && (
        <div className="bg-blue-50 border-t border-gray-200 text-center py-2 text-sm text-gray-700">
          Analyzing portfolio of{" "}
          <span className="font-semibold text-blue-700">{investor.name}</span>{" "}
          ({investor.email})
        </div>
      )}
    </nav>
  );
}
