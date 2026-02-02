import Home from "../../components/Home/Home";
import React from "react";
// import PropertySection from "../../components/Propertycard/PropertySection";
import ServiceSection from "../ServiceSection/ServiceSection";
import PropertyList from "../../components/Crads/PropertyList";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Home />
      <PropertyList/>
      <ServiceSection />  
    </div>
  );
};

export default Dashboard;
