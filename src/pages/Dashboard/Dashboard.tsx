import Home, { HomeFilterProvider } from "../../components/Home/Home";
import React from "react";
import ServiceSection from "../ServiceSection/ServiceSection";
import PropertyList from "../../components/Cards/PropertyList";
import StatsSection from "../../components/StatsSection/StatsSection";
import NewlyLaunchedProjects from "../../components/NewlyLaunchedProjects/NewlyLaunchedProjects";
import HomePageSections from "../../components/Home/HomePageSections";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--fg)]">
      <HomeFilterProvider>
        <Home />
        <div id="home-property-listings" className="scroll-mt-24">
          <PropertyList />
        </div>
        <HomePageSections />
      </HomeFilterProvider>
      <NewlyLaunchedProjects />
      <ServiceSection />
      <StatsSection />
    </div>
  );
};

export default Dashboard;
