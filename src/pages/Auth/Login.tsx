import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { login } from "../../features/auth/authSlice";
import Dashboard from "../Dashboard/Dashboard";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await dispatch(
      login({
        email,
        password,
      })
    );

    if (login.fulfilled.match(result)) {
      // If we were redirected here (e.g. trying to access a protected route),
      // always send the user back to that route after login.
      if (from && from !== "/") {
        navigate(from, { replace: true });
        return;
      }

      // Role-based default redirects for direct login.
      const role = result.payload.user.role;

      if (role === "buyer") {
        navigate("/buyer/dashboard", { replace: true });
        return;
      }

      if (role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (role === "seller") {
        navigate("/seller/dashboard", { replace: true });
        return;
      }

      // Fallback: keep existing behavior for other roles.
      navigate("/post-property/basic", { replace: true });
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
        <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-[var(--b2)] bg-[var(--white)] p-8 shadow-2xl shadow-[var(--b1)]/20">
          {/* logo / brand */}
          <div className="mb-6 flex justify-center">
            {/* replace with real logo if available */}
            <span className="text-2xl font-bold text-[var(--b1)]">
              BhoomiWala
            </span>
          </div>

          <h1 className="mb-2 text-center text-2xl font-semibold">
            Admin sign in
          </h1>
          <p className="mb-6 text-center text-xs text-[var(--muted)]">
            Enterprise control panel access.
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
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)]"
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-xs">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-[var(--b2)] text-[var(--b1)] focus:ring-[var(--b2)]"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-xs text-[var(--b1-mid)] hover:text-[var(--b1)]"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] shadow-md hover:bg-[var(--b1)] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;