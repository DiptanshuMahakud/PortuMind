"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
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
    <nav className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* 🔹 Logo / Brand */}
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
          <span className="text-lg font-semibold tracking-tight hover:text-blue-100 transition-colors duration-200">
            Investor Dashboard
          </span>
        </div>

        {/* 🔹 Nav Buttons */}
        <div className="flex items-center gap-5 text-sm font-medium">

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-red-500/80 transition duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
