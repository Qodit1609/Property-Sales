import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostPropertyLayout from "../../components/propertyPost/PostPropertyLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loadEditProperty,
  resetPostProperty,
} from "../../features/postProperty/postPropertySlice";
import { clearPostPropertyDraft } from "../../features/postProperty/postPropertyStorage";
import { useTranslation } from "react-i18next";
import CustomAlert from "@/components/common/CustomAlert";

export default function PostPropertyPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawUserRole = useAppSelector((state) => state.auth.user?.role);
  const userRole = String(rawUserRole ?? "").trim().toLowerCase();
  const canAccess = userRole === "seller" || userRole === "admin";
  const editIdFromUrl = searchParams.get("edit");
  const [unauthorizedAlert, setUnauthorizedAlert] = useState<{
    open: boolean;
    message: string;
    redirectTo: string;
  }>({ open: false, message: "", redirectTo: "/" });

  useEffect(() => {
    if (canAccess) return;

    const message =
      userRole === "buyer"
        ? t("postProperty.page.buyerUnauthorized")
        : t("postProperty.page.roleUnauthorized");
    setUnauthorizedAlert({
      open: true,
      message,
      redirectTo: userRole === "buyer" ? "/buyer/dashboard" : "/",
    });
  }, [canAccess, userRole, t]);

  useEffect(() => {
    if (!canAccess || !editIdFromUrl) return;
    clearPostPropertyDraft();
    void dispatch(loadEditProperty(editIdFromUrl));
  }, [canAccess, dispatch, editIdFromUrl]);

  useEffect(() => {
    if (!canAccess) return;
    const editId = searchParams.get("edit");
    if (editId) return;
    if (userRole !== "admin") return;
    dispatch(resetPostProperty());
  }, [canAccess, dispatch, searchParams, userRole]);

  if (!canAccess) {
    return (
      <CustomAlert
        open={unauthorizedAlert.open}
        title="Access Restricted"
        message={unauthorizedAlert.message}
        onConfirm={() => {
          setUnauthorizedAlert((prev) => ({ ...prev, open: false }));
          navigate(unauthorizedAlert.redirectTo, { replace: true });
        }}
      />
    );
  }

  return <PostPropertyLayout />;
}

