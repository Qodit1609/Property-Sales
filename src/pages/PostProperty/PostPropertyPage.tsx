import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostPropertyLayout from "../../components/propertyPost/PostPropertyLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadEditProperty, setEditPropertyId } from "../../features/postProperty/postPropertySlice";
import { useTranslation } from "react-i18next";

export default function PostPropertyPage() {
  const { t } = useTranslation();
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
        ? t("postProperty.page.buyerUnauthorized")
        : t("postProperty.page.roleUnauthorized");
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
    if (!editId) return;
    if (editPropertyId === editId) return;
    void dispatch(loadEditProperty(editId));
  }, [canAccess, dispatch, editPropertyId, searchParams]);

  if (!canAccess) {
    return null;
  }

  return <PostPropertyLayout />;
}

