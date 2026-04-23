import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common";
import { useAppSelector } from "../../hooks/reduxHooks";
import { sellerSettingsFormSchema, type SellerSettingsFormValues } from "./sellerProfileSchema";

const SellerSettingsPage = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const userId = String(user?.id ?? user?._id ?? "");
  const settingsKey = useMemo(() => `sellerNotificationSettings:${userId || "guest"}`, [userId]);
  const savedSettings = useMemo(() => {
    try {
      const raw = localStorage.getItem(settingsKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<SellerSettingsFormValues>;
      return {
        leadAlerts: !!parsed.leadAlerts,
        listingAlerts: !!parsed.listingAlerts,
      };
    } catch {
      return null;
    }
  }, [settingsKey]);
  const { register, handleSubmit, watch } = useForm<SellerSettingsFormValues>({
    resolver: zodResolver(sellerSettingsFormSchema),
    defaultValues: {
      leadAlerts: savedSettings?.leadAlerts ?? false,
      listingAlerts: savedSettings?.listingAlerts ?? false,
    },
  });
  const watchedValues = watch();

  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(watchedValues));
    window.dispatchEvent(new Event("seller-notification-settings-changed"));
  }, [settingsKey, watchedValues]);

  const onSubmit = handleSubmit(() => {
    /* local preferences — wire to API when available */
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.settings.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.settings.sub")}</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="max-w-2xl space-y-6 rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-[var(--b2)]/60 pb-4">
          <Bell className="h-5 w-5 text-[var(--b1-mid)]" />
          <h2 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.settings.notifications")}</h2>
        </div>

        {(
          [
            ["leadAlerts", t("sellerPanel.settings.leads")] as const,
            ["listingAlerts", t("sellerPanel.settings.listings")] as const,
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--b2)]/60 bg-[var(--b2-soft)]/30 px-4 py-3 transition hover:bg-[var(--b2-soft)]/60"
          >
            <span className="text-sm font-medium text-[var(--b1)]">{label}</span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[var(--b1)]"
              {...register(key)}
            />
          </label>
        ))}

        <Button
          type="submit"
          className="!rounded-xl !bg-[var(--b1)] !px-5 !py-2.5 !text-[var(--fg)] hover:!opacity-90"
        >
          {t("sellerPanel.settings.save")}
        </Button>
      </motion.form>
    </section>
  );
};

export default SellerSettingsPage;
