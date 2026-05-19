import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { AppRole } from "../../features/auth/roleTypes";
import {
  getMandatoryProfilePathForRole,
  isProfileCompletionMandatory,
} from "../../lib/profileCompletionGuard";
import CustomAlert from "@/components/common/CustomAlert";

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
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

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

  const restrictedToProfile = isProfileCompletionMandatory(user);
  const mandatoryProfilePath = getMandatoryProfilePathForRole(userRole);
  const isOnMandatoryProfilePath =
    Boolean(mandatoryProfilePath) && location.pathname === mandatoryProfilePath;

  useEffect(() => {
    setShowProfileAlert(
      Boolean(restrictedToProfile && mandatoryProfilePath && !isOnMandatoryProfilePath),
    );
  }, [restrictedToProfile, mandatoryProfilePath, isOnMandatoryProfilePath]);

  if (restrictedToProfile && mandatoryProfilePath && !isOnMandatoryProfilePath) {
    return (
      <CustomAlert
        open={showProfileAlert}
        title={t("common.profileIncompleteTitle")}
        message={t("common.profileIncompleteMessage")}
        onConfirm={() => {
          setShowProfileAlert(false);
          navigate(mandatoryProfilePath, { replace: true });
        }}
      />
    );
  }

  if (children != null) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
