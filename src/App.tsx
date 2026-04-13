import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Suspense, useEffect, type ReactNode } from "react";
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
import SellerPropertiesPage from "./pages/Seller/SellerPropertiesPage";
import SellerLayout from "./components/seller/SellerLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPropertiesPage from "./pages/Admin/AdminPropertiesPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminLogsPage from "./pages/Admin/AdminLogsPage";
import ActivityLogs from "./pages/Admin/ActivityLogs";
import AdminNotificationsPage from "./pages/Admin/AdminNotificationsPage";
import AdminSellersPage from "./pages/Admin/AdminSellersPage";
import AdminAccountPage from "./pages/Admin/AdminAccountPage";
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
import { useAppDispatch } from "./store/hooks";
import { fetchProperties } from "./features/properties/propertySlice";
import { fetchPropertyMedia } from "./features/media/mediaSlice";
import PostPropertyPage from "./pages/PostProperty/PostPropertyPage";
import React from "react";
import { SellerStatsSkeleton } from "./components/seller/SellerSkeleton";
import BuyerCompareToast from "./components/buyer/BuyerCompareToast";
import BuyerFeedbackToast from "./components/buyer/BuyerFeedbackToast";
import NotificationSync from "./features/notifications/NotificationSync";

const SellerLeadsPage = React.lazy(() => import("./pages/Seller/SellerLeadsPage"));
const SellerAnalyticsPage = React.lazy(() => import("./pages/Seller/SellerAnalyticsPage"));
const SellerMessagesPage = React.lazy(() => import("./pages/Seller/SellerMessagesPage"));
const SellerNotificationsPage = React.lazy(() => import("./pages/Seller/SellerNotificationsPage"));
const SellerPromotionsPage = React.lazy(() => import("./pages/Seller/SellerPromotionsPage"));
const SellerProfilePage = React.lazy(() => import("./pages/Seller/SellerProfilePage"));
const SellerSettingsPage = React.lazy(() => import("./pages/Seller/SellerSettingsPage"));

function SellerLazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<SellerStatsSkeleton />}>{children}</Suspense>;
}

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
const PropertyDocumentsStep = React.lazy(
  () => import("./components/propertyPost/PropertyDocumentsStep")
);
const AmenitiesForm = React.lazy(
  () => import("./components/propertyPost/AmenitiesForm")
);
const ReviewSubmit = React.lazy(
  () => import("./components/propertyPost/ReviewSubmit")
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 50 }));
    dispatch(fetchPropertyMedia());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NotificationSync />
      <BuyerCompareToast />
      <BuyerFeedbackToast />
      <Routes>

        {/* Public routes WITH header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/farmhouse" element={<Farmhouse />} />
          <Route path="/agriculture-land" element={<AgricultureLand />} />
          <Route path="/resort-properties" element={<ResortProperties />} />
          <Route path="/rent-farmhouse" element={<RentFarmhouse />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          {/* Post Property (authenticated users; page-level guard allows seller/admin only) */}
          <Route
            element={
              <ProtectedRoute requiredRoles={["seller", "buyer", "agent", "admin"]} />
            }
          >
            <Route path="/post-property" element={<PostPropertyPage />}>
              <Route index element={<Navigate to="basic" replace />} />
              <Route path="basic" element={<BasicDetailsForm />} />
              <Route path="location" element={<LocationForm />} />
              <Route path="profile" element={<PropertyProfileForm />} />
              <Route path="media" element={<MediaUpload />} />
              <Route path="documents" element={<PropertyDocumentsStep />} />
              <Route path="amenities" element={<AmenitiesForm />} />
              <Route path="review" element={<ReviewSubmit />} />
            </Route>
          </Route>
        </Route>

        {/* Buyer area (no MainLayout) */}
        <Route path="/buyer" element={<ProtectedRoute requiredRoles={["buyer"]} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="wishlist" element={<BuyerWishlistPage />} />
          <Route path="compare" element={<BuyerComparePage />} />
          <Route path="cart" element={<BuyerCartPage />} />
          <Route path="account" element={<BuyerAccountPage />} />
          <Route path="activity" element={<BuyerActivityPage />} />
          <Route path="enquiries" element={<BuyerEnquiriesPage />} />
          <Route path="notifications" element={<BuyerNotificationsPage />} />
        </Route>

        {/* Seller area — explicit routes (RR7 + nested pathless layouts can render nothing) */}
        <Route
          path="/seller"
          element={<Navigate to="/seller/dashboard" replace />}
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerDashboard />
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/properties"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerPropertiesPage />
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/leads"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerLeadsPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/analytics"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerAnalyticsPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/messages"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerMessagesPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/notifications"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerNotificationsPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/promotions"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerPromotionsPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerProfilePage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/settings"
          element={
            <ProtectedRoute requiredRoles={["seller"]}>
              <SellerLayout>
                <SellerLazy>
                  <SellerSettingsPage />
                </SellerLazy>
              </SellerLayout>
            </ProtectedRoute>
          }
        />

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
          <Route path="/admin/account" element={<AdminAccountPage />} />
          <Route path="/admin/properties" element={<AdminPropertiesPage />} />
          <Route path="/admin/sellers" element={<AdminSellersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/logs" element={<AdminLogsPage />} />
          <Route path="/admin/activity-logs" element={<ActivityLogs />} />
          <Route
            path="/admin/notifications"
            element={<AdminNotificationsPage />}
          />
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