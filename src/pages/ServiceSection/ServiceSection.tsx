import React from "react";
import {
  Home,
  Building2,
  Briefcase,
  Warehouse
} from "lucide-react";

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
    <section className="bg-[#FFFBE6] py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">

        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="w-28 h-[1px] bg-[#347928]/40" />

          <p className="text-[#347928] font-medium">
            OUR SERVICES
          </p>

          <div className="w-28 h-[1px] bg-[#347928]/40" />
        </div>

        <p className="max-w-3xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed mb-12">
          We provide end-to-end real estate solutions focused on farmhouses,
          villas, resort properties, and agricultural land, ensuring
          transparency, expert guidance, and long-term value for every client.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group rounded-2xl p-8 text-left cursor-pointer transition-all duration-300
                ${
                  service.active
                    ? "bg-[#347928] text-white"
                    : "bg-white text-gray-800 hover:bg-[#347928]"
                }`}
            >
              <div
                className={`mb-6 transition-colors
                  ${
                    service.active
                      ? "text-white"
                      : "text-[#347928] group-hover:text-white"
                  }`}
              >
                {service.icon}
              </div>

              <h3
                className={`text-xl font-semibold mb-3 transition-colors
                  ${
                    service.active
                      ? "text-white"
                      : "text-gray-900 group-hover:text-white"
                  }`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm mb-6 transition-colors
                  ${
                    service.active
                      ? "text-[#C0EBA6]"
                      : "text-gray-600 group-hover:text-[#C0EBA6]"
                  }`}
              >
                {service.description}
              </p>

              <span
                className={`text-sm font-semibold transition-colors
                  ${
                    service.active
                      ? "text-[#FCCD2A]"
                      : "text-[#FCCD2A] group-hover:text-[#FFFBE6]"
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
