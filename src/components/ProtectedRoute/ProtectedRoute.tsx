import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { UserRole } from "../../features/users/userType";

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  requiredRoles,
}) => {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const allowedRoles = requiredRoles ?? (requiredRole ? [requiredRole] : null);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

