import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { login } from "../../features/auth/authSlice";

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
      const role = result.payload.user.role;

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "seller") {
        navigate("/seller", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--b2-soft)] pt-20 pb-10 text-[var(--b1)]">
      <div className="w-full max-w-md bg-[var(--white)] shadow-lg rounded-2xl p-8 border border-[var(--b2)]">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Sign in to your account
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-[var(--error-bg)] px-3 py-2 text-sm text-[var(--error)]">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)]"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] focus:border-[var(--b2)]"
              placeholder="••••••••"
              required
            />
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
  );
};

export default Login;