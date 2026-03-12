import React from "react";

const SecuritySettings: React.FC = () => {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--b1)]">
        Security & password
      </h2>
      <p className="text-[11px] text-[var(--muted)]">
        Enterprise-grade guardrails for your account. Password & OTP flows are
        wired for backend integration.
      </p>

      <form
        className="space-y-3 text-xs text-[var(--b1)]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              Current password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              New password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="Strong password"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              Confirm password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="rounded-lg bg-[var(--b1-mid)] px-4 py-2 text-[11px] font-semibold text-[var(--fg)] shadow ring-1 ring-[var(--b2)] hover:bg-[var(--b1)]"
          >
            Update password
          </button>
          <button
            type="button"
            className="text-[11px] font-medium text-[var(--b1-mid)] underline-offset-2 hover:underline"
          >
            Forgot password? Start OTP flow
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;

