import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/components/common";

const SecuritySettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--b1)]">
        {t("buyerPanel.security.title")}
      </h2>
      <p className="text-[11px] text-[var(--muted)]">{t("buyerPanel.security.subtitle")}</p>

      <form
        className="space-y-3 text-xs text-[var(--b1)]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              {t("buyerPanel.security.currentPassword")}
            </label>

            <Input
              type="password"
              placeholder="••••••••"
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              {t("buyerPanel.security.newPassword")}
            </label>

            <Input
              type="password"
              placeholder={t("buyerPanel.security.strongPassword")}
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              {t("buyerPanel.security.confirmPassword")}
            </label>

            <Input
              type="password"
              placeholder={t("buyerPanel.security.repeatPassword")}
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
            {t("buyerPanel.security.updatePassword")}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="text-[11px] font-medium underline-offset-2 hover:underline"
          >
            {t("buyerPanel.security.forgotPassword")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
