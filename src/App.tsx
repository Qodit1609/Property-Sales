import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Farmhouse from "./pages/Farmhouse/Farmhouse";
import ResortProperties from "./pages/ResortProperties/ResortProperties";
import AgricultureLand from "./pages/AgricultureLand/AgricultureLand";
import RentFarmhouse from "./pages/RentFarmhouse/RentFarmhouse";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SellerDashboard from "./pages/Seller/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAppDispatch } from "./hooks/reduxHooks";
import { fetchProperties } from "./features/properties/propertySlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 50 }));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes WITH header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmhouse" element={<Farmhouse />} />
          <Route path="/agriculture-land" element={<AgricultureLand />} />
          <Route path="/resort-properties" element={<ResortProperties />} />
          <Route path="/rent-farmhouse" element={<RentFarmhouse />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
        </Route>

        {/* Login route WITHOUT header/footer */}
        <Route path="/login" element={<Login />} />

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Seller protected routes */}
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route path="/seller" element={<SellerDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;