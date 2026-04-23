import { Home, Building2, Briefcase, Warehouse } from "lucide-react";
import type { Service } from "./ServiceSection.types";

/** Default catalog — swap for API response mapping later */
export const DEFAULT_SERVICES: Service[] = [
  {
    id: "farmhouse-development",
    title: "Farmhouse Development",
    description:
      "We help you buy, sell, and develop premium farmhouses with complete legal and planning support.",
    icon: <Home size={32} strokeWidth={1.75} />,
  },
  {
    id: "agricultural-land",
    title: "Agricultural Land",
    description:
      "Expert guidance for purchasing and selling agricultural land with verified documents.",
    icon: <Building2 size={32} strokeWidth={1.75} />,
    active: true,
  },
  {
    id: "resort-properties",
    title: "Resort Properties",
    description:
      "Discover high-return resort properties ideal for investment and hospitality businesses.",
    icon: <Briefcase size={32} strokeWidth={1.75} />,
  },
  {
    id: "farmhouse-rental",
    title: "Farmhouse Rental",
    description:
      "Short-term and long-term farmhouse rental solutions for events and vacations.",
    icon: <Warehouse size={32} strokeWidth={1.75} />,
  },
];
