import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, resetError } from "../../features/auth/authSlice";
import type { RegisterRequest } from "../../features/auth/authTypes";
import Dashboard from "../Dashboard/Dashboard";
import { ToastStack, type ToastMessage } from "../../components/propertyPost/Toast";
import { Input, Button } from "@/components/common";

type Role = RegisterRequest["role"];

const roleToPostAuthPath = (role: Role) => {
  if (role === "buyer") return "/buyer/account";
  if (role === "seller") return "/seller/profile";
  return "/agent/dashboard";
};

const backendRoleToUiRole = (role: string | undefined, fallback: Role): Role => {
  if (role === "user" || role === "buyer") return "buyer";
  if (role === "seller") return "seller";
  if (role === "agent") return "agent";
  return fallback;
};

const Register: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [role, setRole] = useState<Role>("buyer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [propertyFocusType, setPropertyFocusType] = useState("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [investmentInterest, setInvestmentInterest] = useState("");

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    dispatch(resetError());
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now() + Math.random());

      setToasts((prev) => [...prev, { id, ...toast }]);
    },
    []
  );

  const roleHint = useMemo(() => {
    if (role === "seller") return t("auth.register.hints.seller");
    if (role === "agent") return t("auth.register.hints.agent");
    return t("auth.register.hints.buyer");
  }, [role, t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      pushToast({
        kind: "error",
        title: t("auth.toast.passwordMismatch.title"),
        detail: t("auth.toast.passwordMismatch.detail"),
      });
      return;
    }

    const exp =
      role === "agent" && experienceYears.trim() !== ""
        ? Number(experienceYears)
        : undefined;

    const result = await dispatch(
      registerUser({
        name,
        email,
        mobile: mobile.trim() ? mobile : undefined,
        password,
        role,
        propertyFocusType: role === "seller" ? propertyFocusType : undefined,
        experienceYears: role === "agent" ? exp : undefined,
        investmentInterest: role === "buyer" ? investmentInterest : undefined,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      pushToast({
        kind: "success",
        title: t("auth.toast.success.title"),
        detail: t("auth.toast.success.detail"),
      });

      const resolvedRole = backendRoleToUiRole(result.payload.user?.role, role);
      navigate(roleToPostAuthPath(resolvedRole), {
        replace: true,
      });
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--b1)]">

      <div className="pointer-events-none select-none blur-sm brightness-75">
        <Dashboard />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-black/20" />

      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 py-8">

        <div className="pointer-events-auto w-full max-w-2xl rounded-3xl border border-[var(--b2)] bg-[var(--white)] p-7 sm:p-8 shadow-2xl shadow-[var(--b1)]/20 relative">

          <Button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            aria-label={t("common.close")}
            className="absolute right-4 top-6 h-8 w-8 flex items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1)] hover:bg-[var(--b2)] transition"
          >
            ✕
          </Button>

          <div className="mb-6 flex justify-center mt-2">
            <span className="text-2xl font-bold text-[var(--b1)]">
              {t("auth.brand")}
            </span>
          </div>

          <h1 className="mb-2 text-center text-2xl font-semibold">
            {t("auth.register.title")}
          </h1>

          <p className="mb-6 text-center text-xs text-[var(--muted)]">
            {t("auth.register.subtitle")}
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">

            {/* Role */}
            <div>
              <p className="mb-2 block text-sm font-medium">{t("auth.register.role")}</p>

              <div className="grid grid-cols-3 gap-2">
                {(["buyer", "seller", "agent"] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-center text-xs font-semibold transition ${
                      role === r
                        ? "border-[var(--b2)] bg-[var(--b2-soft)] text-[var(--b1)]"
                        : "border-[var(--b2)] bg-[var(--white)] text-[var(--b1-mid)] hover:bg-[var(--b2-soft)]"
                    }`}
                  >
                    <Input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="sr-only"
                    />
                    <span className="block w-full text-center">
                      {t(`auth.register.roles.${r}`)}
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-2 text-[11px] text-[var(--muted)]">{roleHint}</p>
            </div>

            {/* Form Grid */}
            <div className="grid sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{t("auth.fields.name")}</label>
                <Input
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder={t("auth.placeholders.fullName")}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{t("auth.fields.email")}</label>
                <Input
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder={t("auth.placeholders.email")}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{t("auth.fields.mobile")}</label>
                <Input
                  autoComplete="off"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder={t("common.optional")}
                />
              </div>

              {role === "buyer" && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-sm font-medium">
                    {t("auth.fields.investmentInterest")}
                  </label>
                  <Input
                    autoComplete="off"
                    value={investmentInterest}
                    onChange={(e) => setInvestmentInterest(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    placeholder="Weekend home, long term, rental..."
                  />
                </div>
              )}

              {role === "seller" && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-sm font-medium">
                    {t("auth.fields.propertyFocusType")}
                  </label>
                  <Input
                    autoComplete="off"
                    value={propertyFocusType}
                    onChange={(e) => setPropertyFocusType(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    placeholder="Farmhouse, Resort, Land..."
                  />
                </div>
              )}

              {role === "agent" && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-sm font-medium">
                    {t("auth.fields.experienceYears")}
                  </label>
                  <Input
                    autoComplete="off"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    placeholder={t("auth.placeholders.experienceYears")}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{t("auth.fields.password")}</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 pr-16 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent px-2 py-1 text-sm font-medium hover:border-[var(--b2)] hover:bg-[var(--b1-mid)] transition"
                    aria-label={
                      showPassword ? t("auth.actions.hidePassword") : t("auth.actions.showPassword")
                    }
                  >
                    {showPassword ? t("auth.actions.hide") : t("auth.actions.show")}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">{t("auth.fields.confirmPassword")}</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 pr-16 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent px-2 py-1 text-sm font-medium hover:border-[var(--b2)] hover:bg-[var(--b1-mid)] transition"
                    aria-label={
                      showConfirmPassword
                        ? t("auth.actions.hideConfirmPassword")
                        : t("auth.actions.showConfirmPassword")
                    }
                  >
                    {showConfirmPassword ? t("auth.actions.hide") : t("auth.actions.show")}
                  </Button>
                </div>
              </div>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.register.submitting") : t("auth.register.submit")}
            </Button>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full inline-flex justify-center items-center rounded-md border border-[var(--b2)] bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)]  transition"
            >
              {t("auth.register.signInCta")}
            </Button>

            <div className="pt-1 text-center text-xs text-[var(--muted)]">
              {t("auth.register.terms")}
            </div>

          </form>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default Register;