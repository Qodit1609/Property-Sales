import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostPropertyLayout from "../../components/propertyPost/PostPropertyLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadEditProperty, setEditPropertyId } from "../../features/postProperty/postPropertySlice";

export default function PostPropertyPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const canAccess = userRole === "seller" || userRole === "admin";
  const editPropertyId = useAppSelector((state) => state.postProperty.editPropertyId);

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

  useEffect(() => {
    if (!canAccess) return;
    const editId = searchParams.get("edit");
    if (!editId) {
      if (editPropertyId) {
        dispatch(setEditPropertyId(null));
      }
      return;
    }
    if (editPropertyId === editId) return;
    void dispatch(loadEditProperty(editId));
  }, [canAccess, dispatch, editPropertyId, searchParams]);

  if (!canAccess) {
    return null;
  }

  return <PostPropertyLayout />;
}

