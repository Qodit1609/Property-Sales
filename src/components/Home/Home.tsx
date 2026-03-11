import HeroSection from "./HeroSection";
import FilterBar, { type FilterValues } from "./FilterBar";

const Home: React.FC = () => {
  const handleSearch = (filters: FilterValues) => {
    console.log("Search filters:", filters);
    // TODO: Implement search functionality with filters
  };

  return (
    <section className="relative min-h-[120vh] pt-[80px] pb-[220px]">
      <HeroSection />
      <FilterBar onSearch={handleSearch} />
    </section>
  );
};

export default Home;
