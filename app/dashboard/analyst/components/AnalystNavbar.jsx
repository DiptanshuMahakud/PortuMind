"use client";
import { useRouter, usePathname } from "next/navigation";
import axios from "@/utils/axios";
import toast from "react-hot-toast";

export default function AnalystNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1
          onClick={() => router.push("/dashboard/analyst")}
          className="text-xl font-semibold text-blue-700 cursor-pointer"
        >
          Analyst Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/analyst/request")}
            className={`px-4 py-1 rounded-md ${
              pathname.includes("request")
                ? "bg-blue-600 text-white"
                : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            Requests
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
