import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { Button } from "@/components/common";
import { sellerProfileFormSchema, type SellerProfileFormValues } from "./sellerProfileSchema";

const SellerProfilePage = () => {
  const { t } = useTranslation();
  const user = useAppSelector((s: RootState) => s.auth.user);

  const defaults = useMemo<SellerProfileFormValues>(
    () => ({
      displayName: user?.name ?? "",
      company: "",
      phone: (user?.mobile as string | undefined) ?? "",
      city: "",
      gstin: "",
      bio: "",
    }),
    [user?.mobile, user?.name]
  );

  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileFormSchema),
    defaultValues: defaults,
    values: defaults,
  });

  const onSubmit = handleSubmit(() => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  });

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.profile.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.profile.sub")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="xl:col-span-2 space-y-4 rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-6 shadow-sm"
        >
          <h2 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.profile.sectionMain")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.name")}</span>
              <input
                {...register("displayName")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
              {errors.displayName ? (
                <span className="mt-1 block text-xs text-[var(--error)]">{errors.displayName.message}</span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.company")}</span>
              <input
                {...register("company")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.phone")}</span>
              <input
                {...register("phone")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.city")}</span>
              <input
                {...register("city")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.gstin")}</span>
              <input
                {...register("gstin")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-[var(--b1)]">{t("sellerPanel.profile.bio")}</span>
              <textarea
                {...register("bio")}
                rows={4}
                className="mt-1 w-full resize-y rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              className="!rounded-xl !bg-[var(--b1)] !px-5 !py-2.5 !text-[var(--fg)] hover:!opacity-90"
            >
              {t("sellerPanel.profile.save")}
            </Button>
            {saved ? (
              <span className="text-sm font-medium text-[var(--success)]">{t("sellerPanel.profile.savedUi")}</span>
            ) : null}
          </div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="space-y-4 rounded-2xl border border-[var(--b2)]/80 bg-[var(--b2-soft)]/40 p-6 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[var(--b1-mid)]" />
            <div>
              <h3 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.profile.verifyTitle")}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.profile.verifySub")}</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-[var(--b1)]">
            <li className="flex items-center justify-between rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--b1-mid)]" />
                {t("sellerPanel.profile.docPan")}
              </span>
              <span className="text-xs font-medium text-[var(--warning)]">{t("sellerPanel.profile.pending")}</span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--b1-mid)]" />
                {t("sellerPanel.profile.docAddress")}
              </span>
              <span className="text-xs font-medium text-[var(--muted)]">{t("sellerPanel.profile.optional")}</span>
            </li>
          </ul>
        </motion.aside>
      </div>
    </section>
  );
};

export default SellerProfilePage;
