"use client";
import StockCard from "./StockCard";

export default function PortfolioGrid({ holdings }) {
  if (!holdings?.length)
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-medium">No stocks imported yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Use the <span className="text-blue-600 font-semibold">Import Stocks</span> button to get started.
        </p>
      </div>
    );

  return (
    <div className="w-full">
      {/* Section Header */}
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center md:text-left">
        Current Stocks and Their Data
      </h2>

      {/* Responsive Grid */}
      <div
        className="
          grid
          gap-6
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          w-full
        "
      >
        {holdings.map((stock, i) => (
          <div
            key={i}
            className="
              transform
              hover:scale-[1.02]
              transition-transform
              duration-200
              ease-out
            "
          >
            <StockCard stock={stock} />
          </div>
        ))}
      </div>
    </div>
  );
}
