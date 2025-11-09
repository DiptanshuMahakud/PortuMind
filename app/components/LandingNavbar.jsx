"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { User } from "lucide-react";

export default function LandingNavbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/api/verify");
        if (res.data?.user) setUserRole(res.data.user.role);
      } catch {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const handleDashboardClick = () => {
    if (!userRole) return router.push("/login");
    router.push(
      userRole === "analyst" ? "/dashboard/analyst" : "/dashboard/investor"
    );
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      {/* 🔹 Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
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
      <div className="flex items-center gap-6"> {/* Increased spacing */}
        <button
          onClick={handleDashboardClick}
          className="text-gray-700 font-medium hover:text-blue-600 transition"
        >
          Dashboard
        </button>

        {!loading &&
          (userRole ? (
            <div className="p-2 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200 transition">
              <User size={20} className="text-blue-700" />
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          ))}
      </div>
    </nav>
  );
}
