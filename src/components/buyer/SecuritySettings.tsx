import React from "react";
import { Button, Input } from "@/components/common";

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

            <Input
              type="password"
              placeholder="••••••••"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              New password
            </label>

            <Input
              type="password"
              placeholder="Strong password"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              Confirm password
            </label>

            <Input
              type="password"
              placeholder="Repeat new password"
              className="mt-1 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            className="text-[11px] px-4 py-2"
          >
            Update password
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="text-[11px] font-medium underline-offset-2 hover:underline"
          >
            Forgot password? Start OTP flow
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;