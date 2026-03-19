import Home from "../../components/Home/Home";
import React from "react";
import ServiceSection from "../ServiceSection/ServiceSection";
import PropertyList from "../../components/Cards/PropertyList";
import StatsSection from "../../components/StatsSection/StatsSection";
import NewlyLaunchedProjects from "../../components/NewlyLaunchedProjects/NewlyLaunchedProjects";
import HomePageSections from "../../components/Home/HomePageSections";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--fg)]">
      <Home />
      <PropertyList />
      <HomePageSections />
      <NewlyLaunchedProjects />
      <ServiceSection />
      <StatsSection />
    </div>
  );
};

export default Dashboard;
