import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Farmhouse from "./pages/Farmhouse/Farmhouse";
import ResortProperties from "./pages/ResortProperties/ResortProperties";
import AgricultureLand from "./pages/AgricultureLand/AgricultureLand";
import RentFarmhouse from "./pages/RentFarmhouse/RentFarmhouse";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SellerDashboard from "./pages/Seller/SellerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPropertiesPage from "./pages/Admin/AdminPropertiesPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminLogsPage from "./pages/Admin/AdminLogsPage";
import BuyerDashboard from "./pages/Buyer/BuyerDashboard";
import BuyerWishlistPage from "./pages/Buyer/BuyerWishlistPage";
import BuyerComparePage from "./pages/Buyer/BuyerComparePage";
import BuyerCartPage from "./pages/Buyer/BuyerCartPage";
import BuyerAccountPage from "./pages/Buyer/BuyerAccountPage";
import BuyerActivityPage from "./pages/Buyer/BuyerActivityPage";
import BuyerEnquiriesPage from "./pages/Buyer/BuyerEnquiriesPage";
import BuyerNotificationsPage from "./pages/Buyer/BuyerNotificationsPage";
import AgentDashboard from "./pages/Agent/AgentDashboard";
import AgentLayout from "./pages/Agent/AgentLayout";
import AgentPropertiesPage from "./pages/Agent/AgentPropertiesPage";
import AgentAddPropertyPage from "./pages/Agent/AgentAddPropertyPage";
import AgentLeadsPage from "./pages/Agent/AgentLeadsPage";
import AgentVisitsPage from "./pages/Agent/AgentVisitsPage";
import AgentClientsPage from "./pages/Agent/AgentClientsPage";
import AgentProfilePage from "./pages/Agent/AgentProfilePage";
import { useAppDispatch } from "./hooks/reduxHooks";
import { fetchProperties } from "./features/properties/propertySlice";
import PostPropertyPage from "./pages/PostProperty/PostPropertyPage";
import React from "react";

const BasicDetailsForm = React.lazy(
  () => import("./components/propertyPost/BasicDetailsForm")
);
const LocationForm = React.lazy(
  () => import("./components/propertyPost/LocationForm")
);
const PropertyProfileForm = React.lazy(
  () => import("./components/propertyPost/PropertyProfileForm")
);
const MediaUpload = React.lazy(
  () => import("./components/propertyPost/MediaUpload")
);
const AmenitiesForm = React.lazy(
  () => import("./components/propertyPost/AmenitiesForm")
);
const ReviewSubmit = React.lazy(
  () => import("./components/propertyPost/ReviewSubmit")
);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 50 }));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>

        {/* Public routes WITH header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmhouse" element={<Farmhouse />} />
          <Route path="/agriculture-land" element={<AgricultureLand />} />
          <Route path="/resort-properties" element={<ResortProperties />} />
          <Route path="/rent-farmhouse" element={<RentFarmhouse />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          {/* Post Property (Seller/User/Agent) */}
          <Route
            element={<ProtectedRoute requiredRoles={["seller", "user", "agent"]} />}
          >
            <Route path="/post-property" element={<PostPropertyPage />}>
              <Route index element={<Navigate to="basic" replace />} />
              <Route path="basic" element={<BasicDetailsForm />} />
              <Route path="location" element={<LocationForm />} />
              <Route path="profile" element={<PropertyProfileForm />} />
              <Route path="media" element={<MediaUpload />} />
              <Route path="amenities" element={<AmenitiesForm />} />
              <Route path="review" element={<ReviewSubmit />} />
            </Route>
          </Route>
        </Route>

        {/* Buyer area WITHOUT main header/footer
            Allow both explicit 'buyer' role and legacy 'user' role (treated as buyer). */}
        <Route element={<ProtectedRoute requiredRoles={["buyer", "user"]} />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/wishlist" element={<BuyerWishlistPage />} />
          <Route path="/buyer/compare" element={<BuyerComparePage />} />
          <Route path="/buyer/cart" element={<BuyerCartPage />} />
          <Route path="/buyer/account" element={<BuyerAccountPage />} />
          <Route path="/buyer/activity" element={<BuyerActivityPage />} />
          <Route path="/buyer/enquiries" element={<BuyerEnquiriesPage />} />
          <Route
            path="/buyer/notifications"
            element={<BuyerNotificationsPage />}
          />
        </Route>

        {/* Seller dashboard */}
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Route>

        {/* Agent dashboard */}
        <Route element={<ProtectedRoute requiredRole="agent" />}>
          <Route element={<AgentLayout />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/properties" element={<AgentPropertiesPage />} />
            <Route path="/agent/add-property" element={<AgentAddPropertyPage />} />
            <Route path="/agent/leads" element={<AgentLeadsPage />} />
            <Route path="/agent/visits" element={<AgentVisitsPage />} />
            <Route path="/agent/clients" element={<AgentClientsPage />} />
            <Route path="/agent/profile" element={<AgentProfilePage />} />
          </Route>
        </Route>

        {/* Admin dashboard */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<AdminPropertiesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/logs" element={<AdminLogsPage />} />
        </Route>

        {/* Login route WITHOUT header/footer */}
        <Route path="/login" element={<Login />} />

        {/* Register route WITHOUT header/footer */}
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;