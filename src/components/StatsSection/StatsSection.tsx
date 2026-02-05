import React from "react";

type Stat = {
  value: string;
  label: string;
};

const stats: Stat[] = [
  { value: "4.8 ★", label: "Average Rating" },
  { value: "5+", label: "Years Experience" },
  { value: "200+", label: "Happy Clients" },
];

const StatsSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-br from-green-50 via-white to-green-100 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* 🔝 Trust Content */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Trusted by Our Clients
        </h2>

        <p className="mt-3 text-lg font-semibold text-green-700">
          ⭐ Rated 4.8 ★ by 200+ Clients
        </p>

        <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
          We are highly rated for our transparency, expert guidance, and commitment
          to delivering long-term value across farmhouses, villas, resort properties,
          and agricultural land investments.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-green-600 mx-auto my-10 rounded-full"></div>

        {/* 📊 Stats Strip (NO CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-5xl font-extrabold text-green-700">
                {stat.value}
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
