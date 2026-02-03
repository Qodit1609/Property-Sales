import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Farmhouse from "./pages/Farmhouse/Farmhouse";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import ResortProperties from "./pages/ResortProperties/ResortProperties";
import AgricultureLand from "./pages/AgricultureLand/AgricultureLand";
import RentFarmhouse from "./pages/RentFarmhouse/RentFarmhouse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmhouse" element={<Farmhouse />} />
          <Route path="/agriculture-land" element={<AgricultureLand />} />
          <Route path="/resort-properties" element={<ResortProperties />} />
          <Route path="/rent-farmhouse" element={<RentFarmhouse />} />
          <Route path="/property/:id" element={<PropertyDetails />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
