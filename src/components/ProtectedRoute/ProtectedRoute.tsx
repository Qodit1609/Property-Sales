import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { AppRole } from "../../features/auth/roleTypes";

interface ProtectedRouteProps {
  requiredRole?: AppRole;
  requiredRoles?: AppRole[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  requiredRoles,
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const allowedRoles = requiredRoles ?? (requiredRole ? [requiredRole] : null);
  const userRole = user.role;

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  if (children != null) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
