import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common";
import { sellerSettingsFormSchema, type SellerSettingsFormValues } from "./sellerProfileSchema";

const SellerSettingsPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<SellerSettingsFormValues>({
    resolver: zodResolver(sellerSettingsFormSchema),
    defaultValues: {
      emailDigest: true,
      leadAlerts: true,
      listingAlerts: true,
      marketingTips: false,
    },
  });

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
            ["emailDigest", t("sellerPanel.settings.digest")] as const,
            ["leadAlerts", t("sellerPanel.settings.leads")] as const,
            ["listingAlerts", t("sellerPanel.settings.listings")] as const,
            ["marketingTips", t("sellerPanel.settings.marketing")] as const,
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
