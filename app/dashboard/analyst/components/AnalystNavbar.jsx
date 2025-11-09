"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, ClipboardList } from "lucide-react";
import axios from "@/utils/axios";
import toast from "react-hot-toast";

export default function AnalystStockNavbar({ investor }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      toast.success("Logged out");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* 🔹 Left Side — Back & Logo */}
        <div className="flex items-center gap-4">
          {/* <button
            onClick={() => router.push("/dashboard/analyst")}
            className="flex items-center gap-1 text-white/80 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button> */}

          <div
            onClick={() => router.push("/dashboard/analyst")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="PortuMind Logo"
              width={180}
              height={60}
              className="rounded-md"
              priority
            />
            {/* <span className="text-lg font-semibold tracking-tight hover:text-blue-100 transition-colors duration-200">
              Analyst Dashboard
            </span> */}
          </div>
        </div>

        {/* 🔹 Right Side — Navigation */}
        <div className="flex items-center gap-5 text-sm font-medium">
          {/* <button
            onClick={() => router.push("/dashboard/analyst")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition duration-200"
          >
            Dashboard
          </button> */}

          <button
            onClick={() => router.push("/dashboard/analyst/request")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition duration-200"
          >
            <ClipboardList size={18} />
            Requests
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/80 transition duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Investor Info Banner */}
      {investor && (
        <div className="bg-blue-50 border-t border-blue-200 text-center py-2 text-sm text-gray-700">
          Analyzing portfolio of{" "}
          <span className="font-semibold text-blue-700">{investor.name}</span>{" "}
          ({investor.email})
        </div>
      )}
    </nav>
  );
}
