"use client";
import Image from "next/image";

export default function LandingBody() {
  const features = [
    {
      title: "AI Investment Insights",
      desc: "Leverage AI to generate buy, sell, or hold recommendations based on real-time market data.",
    },
    {
      title: "Analyst Collaboration",
      desc: "Assign analysts, share insights, and get personalized human-backed evaluations.",
    },
    {
      title: "Dynamic Portfolio Reports",
      desc: "Access detailed, adaptive reports for every stock in your portfolio — always up to date.",
    },
  ];

  return (
    <section className="py-20 bg-white text-center">
      {/* 🔹 Feature Section */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-12">
        Why Choose PortuMind?
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 mb-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {f.title}
            </h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Image + Text Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6 mt-10">
        {/* Left — Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/landing_image_1.png"
            alt="Finance analytics visualization"
            width={800}
            height={500}
            className="rounded-2xl shadow-md object-cover"
          />
        </div>

        {/* Right — Text */}
        <div className="w-full md:w-1/2 text-left">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Transforming Data into Decisions
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            At <span className="text-blue-600 font-medium">PortuMind</span>,
            we combine the precision of AI with the expertise of human analysts
            to deliver real-time, actionable insights. Whether you’re tracking
            portfolio performance or making strategic investment calls, our
            platform provides the intelligence you need to stay ahead.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Simplify your investment journey with data-driven clarity, enhanced
            collaboration, and intuitive visualizations — all designed to help
            you make smarter, faster financial decisions.
          </p>
        </div>
      </div>

      {/* 🔹 Graph + Text Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 px-6 mt-20">
        {/* Right — Graph Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/graph_image.png"
            alt="Stock market chart visualization"
            width={800}
            height={500}
            className="rounded-2xl shadow-md object-cover"
          />
        </div>

        {/* Left — Text */}
        <div className="w-full md:w-1/2 text-left">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Visualize Performance Like Never Before
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            PortuMind’s interactive charts help you track trends, identify
            breakouts, and understand your portfolio’s growth in real time.
            Whether you’re monitoring daily fluctuations or long-term momentum,
            our visual tools make financial analysis intuitive and actionable.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Stay informed with AI-powered data overlays, historical comparisons,
            and smart recommendations — all in one unified, easy-to-read chart
            system built for investors and analysts alike.
          </p>
        </div>
      </div>
    </section>
  );
}
