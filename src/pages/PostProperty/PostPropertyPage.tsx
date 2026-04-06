import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostPropertyLayout from "../../components/propertyPost/PostPropertyLayout";
import { useAppSelector } from "../../store/hooks";

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const canAccess = userRole === "seller" || userRole === "admin";

  useEffect(() => {
    if (canAccess) return;

    const message =
      userRole === "buyer"
        ? "Buyers are not authorized to post property. Please switch to a seller/admin account."
        : "Only admin, super admin, and seller accounts can access the post property form.";
    window.alert(message);

    if (userRole === "buyer") {
      navigate("/buyer/dashboard", { replace: true });
      return;
    }
    navigate("/", { replace: true });
  }, [canAccess, navigate, userRole]);

  if (!canAccess) {
    return null;
  }

  return <PostPropertyLayout />;
}

