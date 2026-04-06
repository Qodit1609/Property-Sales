import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, resetError } from "../../features/auth/authSlice";
import type { AppRole } from "../../features/auth/roleTypes";
import Dashboard from "../Dashboard/Dashboard";
import { Input, Button } from "@/components/common";

const AUTH_ONLY_PATHS = new Set(["/login", "/register"]);

function pathAllowedForRole(pathname: string, role: AppRole | undefined): boolean {
  if (AUTH_ONLY_PATHS.has(pathname)) return false;
  const r = role ?? "";
  if (pathname.startsWith("/buyer/")) return r === "buyer";
  if (pathname.startsWith("/seller/")) return r === "seller";
  if (pathname.startsWith("/agent/")) return r === "agent";
  if (pathname.startsWith("/admin")) return r === "admin";
  if (pathname.startsWith("/post-property"))
    return r === "seller" || r === "buyer" || r === "agent" || r === "admin";
  return true;
}

function dashboardPathForRole(role: AppRole | undefined): string {
  const r = role ?? "";
  if (r === "buyer") return "/buyer/dashboard";
  if (r === "admin") return "/admin";
  if (r === "seller") return "/seller/dashboard";
  if (r === "agent") return "/agent/dashboard";
  return "/post-property/basic";
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    dispatch(resetError());
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/", { replace: true });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      if (!result.payload.user) {
        navigate("/", { replace: true });
        return;
      }

      const role = result.payload.user.role;

      // Only honor `from` when this role is allowed on that route. Otherwise a
      // buyer who hit login via a seller URL would be bounced to "/" by ProtectedRoute.
      if (from && from !== "/" && pathAllowedForRole(from, role)) {
        navigate(from, { replace: true });
        return;
      }

      navigate(dashboardPathForRole(role), { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--b1)]">
      {/* Blurred home background */}
      <div className="pointer-events-none select-none blur-sm brightness-75">
        <Dashboard />
      </div>

      {/* Overlay */}
      <div className="pointer-events-none fixed inset-0 bg-black/20" />

      {/* Login card */}
      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 py-10">
        <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-[var(--b2)] bg-[var(--white)] p-7 sm:p-8 shadow-2xl shadow-[var(--b1)]/20 relative">
          <Button
                      type="button"
                      onClick={() => navigate("/", { replace: true })}
                      aria-label="Close"
                      className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1)] hover:bg-[var(--b2)] transition"
                    >
                      ✕
                    </Button>

          {/* logo / brand */}
          <div className="mb-5 flex justify-center">
            {/* replace with real logo if available */}
            <span className="text-2xl font-bold text-[var(--b1)]">
              BhoomiWala
            </span>
          </div>

          <h1 className="mb-1 text-center text-2xl font-semibold">Sign in</h1>
          <p className="mb-5 text-center text-xs text-[var(--muted)]">
            Access your dashboard and saved activity.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)] transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2.5 pr-16 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)] transition"
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-transparent px-2 py-1 text-sm font-medium hover:border-[var(--b2)] hover:bg-[var(--b1-mid)] transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex shrink-0 items-center gap-2 text-xs whitespace-nowrap">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-[var(--b2)] text-[var(--b1)] accent-[var(--b1)] focus:ring-[var(--b2)]"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-xs text-[var(--b1-mid)] hover:text-[var(--b1)] whitespace-nowrap"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-md bg-[var(--b1-mid)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="pt-1 text-center text-xs text-[var(--muted)]">
              New here?{" "}
              <Link
                to="/register"
                className="text-[var(--b1-mid)] hover:text-[var(--b1)]"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;