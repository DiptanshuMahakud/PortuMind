"use client";
import { useRouter } from "next/navigation";

export default function LandingHeader() {
  const router = useRouter();

  return (
    <header className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" />
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Empowering Smarter Investments <br /> with AI-Driven Insights
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Collaborate with analysts, understand your portfolio, and make
          intelligent investment decisions — all in one place.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
