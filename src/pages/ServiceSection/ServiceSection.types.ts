import type React from "react";

export interface Service {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface ServiceSectionProps {
  services?: Service[];
}
