"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function StockNavbar() {
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
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        {/* 🔹 Logo Section */}
        <div
          onClick={() => router.push("/dashboard/investor")}
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
        </div>

        {/* 🔹 Right Section */}
        <div className="flex items-center gap-6 text-gray-700">
          <button
            onClick={() => router.push("/dashboard/investor")}
            className="font-medium hover:text-blue-600 transition"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} strokeWidth={2} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
