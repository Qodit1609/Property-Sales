import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, resetError } from "../../features/auth/authSlice";
import type { RegisterRequest } from "../../features/auth/authTypes";
import Dashboard from "../Dashboard/Dashboard";
import { ToastStack, type ToastMessage } from "../../components/propertyPost/Toast";
import { Input, Button } from "@/components/common";

type Role = RegisterRequest["role"];

const roleToDashboard = (role: Role) => {
  if (role === "buyer") return "/buyer/dashboard";
  if (role === "seller") return "/seller/dashboard";
  return "/agent/dashboard";
};

const backendRoleToUiRole = (role: string | undefined, fallback: Role): Role => {
  if (role === "user" || role === "buyer") return "buyer";
  if (role === "seller") return "seller";
  if (role === "agent") return "agent";
  return fallback;
};

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [role, setRole] = useState<Role>("buyer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    if (role === "seller") return "Seller: tell us your property focus.";
    if (role === "agent") return "Agent: share your experience level.";
    return "Buyer: choose your investment interest.";
  }, [role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      pushToast({
        kind: "error",
        title: "Passwords do not match",
        detail: "Please confirm your password again.",
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
        title: "Registration successful",
        detail: "Signing you in and redirecting…",
      });

      const resolvedRole = backendRoleToUiRole(result.payload.user?.role, role);
      navigate(roleToDashboard(resolvedRole), {
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
            aria-label="Close"
            className="absolute right-4 top-6 h-8 w-8 flex items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1)] hover:bg-[var(--b2)] transition"
          >
            ✕
          </Button>

          <div className="mb-6 flex justify-center mt-2">
            <span className="text-2xl font-bold text-[var(--b1)]">
              BhoomiWala
            </span>
          </div>

          <h1 className="mb-2 text-center text-2xl font-semibold">
            Create your account
          </h1>

          <p className="mb-6 text-center text-xs text-[var(--muted)]">
            Choose your role and we’ll take you to the right dashboard.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Role */}
            <div>
              <p className="mb-2 block text-sm font-medium">Role</p>

              <div className="grid grid-cols-3 gap-2">
                {(["buyer", "seller", "agent"] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition ${
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
                    {r === "buyer" ? "USER" : r.toUpperCase()}
                  </label>
                ))}
              </div>

              <p className="mt-2 text-[11px] text-[var(--muted)]">{roleHint}</p>
            </div>

            {/* Form Grid */}
            <div className="grid sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder="Rahul"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder="rahul@gmail.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Mobile</label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  placeholder="Optional"
                />
              </div>

              {role === "buyer" && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-sm font-medium">
                    Investment Interest
                  </label>
                  <Input
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
                    Property focus type
                  </label>
                  <Input
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
                    Experience (years)
                  </label>
                  <Input
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                    placeholder="3"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-[var(--b2)] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--b2)] focus:outline-none"
                  required
                />
              </div>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Register"}
            </Button>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full inline-flex justify-center items-center rounded-md border border-[var(--b2)] bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)]  transition"
            >
              Already have an account? Sign in
            </Button>

            <div className="pt-1 text-center text-xs text-[var(--muted)]">
              By registering, you agree to our{" "}
              <Link
                to="/"
                className="text-[var(--b1-mid)] hover:text-[var(--b1)]"
              >
                terms
              </Link>
              .
            </div>

          </form>
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default Register;