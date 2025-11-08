"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function StockNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div
          onClick={() => router.push("/dashboard/investor")}
          className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition"
        >
          InvestIQ
        </div>

        <div className="flex items-center gap-6 text-gray-700">
          <button
            onClick={() => router.push("/dashboard/investor")}
            className="hover:text-blue-600 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/dashboard/investor/reports")}
            className="hover:text-blue-600 transition"
          >
            Reports
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
    </nav>
  );
}
