"use client";
import { useRouter } from "next/navigation";
import { LogOut, BarChart3 } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo / Title */}
        <h1
          onClick={() => router.push("/dashboard/investor")}
          className="text-2xl font-semibold tracking-tight cursor-pointer hover:text-blue-100 transition-colors duration-200"
        >
          Investor Dashboard
        </h1>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => router.push("/dashboard/investor/reports")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition duration-200"
          >
            <BarChart3 size={18} />
            Reports
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-red-500/80 transition duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
