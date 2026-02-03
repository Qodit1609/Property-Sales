import React from "react";
import { Home, Building2, Briefcase, Warehouse } from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
}

const services: Service[] = [
  {
    title: "Farmhouse Development",
    description:
      "We help you buy, sell, and develop premium farmhouses with complete legal and planning support.",
    icon: <Home size={32} />,
  },
  {
    title: "Agricultural Land",
    description:
      "Expert guidance for purchasing and selling agricultural land with verified documents.",
    icon: <Building2 size={32} />,
    active: true,
  },
  {
    title: "Resort Properties",
    description:
      "Discover high-return resort properties ideal for investment and hospitality businesses.",
    icon: <Briefcase size={32} />,
  },
  {
    title: "Farmhouse Rental",
    description:
      "Short-term and long-term farmhouse rental solutions for events and vacations.",
    icon: <Warehouse size={32} />,
  },
];

const ServiceSection: React.FC = () => {
  return (
    <section className="bg-[#F8F9F1] py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="w-28 h-[1px] bg-[#2D6A4F]/40" />
          <p className="text-[#2D6A4F] font-medium tracking-wide">
            OUR SERVICES
          </p>
          <div className="w-28 h-[1px] bg-[#2D6A4F]/40" />
        </div>

        <p className="max-w-3xl mx-auto text-[#6D4C41] text-base md:text-lg leading-relaxed mb-12">
          We provide end-to-end real estate solutions focused on farmhouses,
          villas, resort properties, and agricultural land, ensuring
          transparency, expert guidance, and long-term value for every client.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group rounded-2xl p-8 text-left cursor-pointer transition-all duration-300 ${
                service.active
                  ? "bg-[#1B4332] text-white"
                  : "bg-[#D8F3DC] text-[#1B4332] hover:bg-[#1B4332]"
              }`}
            >
              <div
                className={`mb-6 transition-colors ${
                  service.active
                    ? "text-[#95D5B2]"
                    : "text-[#2D6A4F] group-hover:text-[#95D5B2]"
                }`}
              >
                {service.icon}
              </div>

              <h3
                className={`text-xl font-semibold mb-3 transition-colors ${
                  service.active
                    ? "text-white"
                    : "text-[#1B4332] group-hover:text-white"
                }`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm mb-6 transition-colors ${
                  service.active
                    ? "text-[#95D5B2]"
                    : "text-[#6D4C41] group-hover:text-[#95D5B2]"
                }`}
              >
                {service.description}
              </p>

              <span
                className={`text-sm font-semibold transition-colors ${
                  service.active
                    ? "text-[#D8F3DC]"
                    : "text-[#2D6A4F] group-hover:text-[#D8F3DC]"
                }`}
              >
                Check it →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
