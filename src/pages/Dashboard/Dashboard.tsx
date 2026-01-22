import React from "react";
import PropertySection from "../../components/Propertycard/PropertySection";
import ServiceSection from "../ServiceSection/ServiceSection";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PropertySection />
      <ServiceSection />      
    </div>
  );
};

export default Dashboard;
