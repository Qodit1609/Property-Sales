import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, FileText, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { Button } from "@/components/common";
import { sellerProfileFormSchema, type SellerProfileFormValues } from "./sellerProfileSchema";
import {
  loadSellerProfile,
  saveSellerProfile,
  setAccountCreatedIfMissing,
} from "../../lib/sellerProfileStorage";
import { useSellerActivityLocal } from "../../hooks/useSellerActivityLocal";

const MAX_PHOTO_BYTES = 1_500_000;

function formatActivityTimestamp(iso: string | null | undefined, locale: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale || "en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

const SellerProfilePage = () => {
  const { t, i18n } = useTranslation();
  const user = useAppSelector((s: RootState) => s.auth.user);
  const email = user?.email;
  const activity = useSellerActivityLocal(email);

  const stored = useMemo(() => loadSellerProfile(email), [email]);

  const defaults = useMemo<SellerProfileFormValues>(
    () => ({
      displayName: stored?.displayName ?? user?.name ?? "",
      company: stored?.company ?? "",
      phone: stored?.phone ?? (user?.mobile as string | undefined) ?? "",
      pan: stored?.pan ?? "",
      aadhaar: stored?.aadhaar ?? "",
      city: stored?.city ?? "",
      gstin: stored?.gstin ?? "",
      bio: stored?.bio ?? "",
      profilePhotoUrl: stored?.profilePhotoUrl ?? null,
    }),
    [stored, user?.mobile, user?.name]
  );

  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [verificationUploads, setVerificationUploads] = useState({
    aadhaar: false,
    pan: false,
  });

  const persistPhoto = useCallback(
    (nextPhotoUrl: string | null) => {
      const current = loadSellerProfile(email);
      saveSellerProfile(email, {
        displayName: current?.displayName ?? defaults.displayName,
        company: current?.company ?? defaults.company,
        phone: current?.phone ?? defaults.phone,
        pan: current?.pan ?? defaults.pan,
        aadhaar: current?.aadhaar ?? defaults.aadhaar,
        city: current?.city ?? defaults.city,
        gstin: current?.gstin ?? defaults.gstin,
        bio: current?.bio ?? defaults.bio,
        profilePhotoUrl: nextPhotoUrl,
      });
    },
    [defaults, email]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileFormSchema),
    defaultValues: defaults,
    values: defaults,
  });

  const [
    watchedDisplayName,
    watchedPhone,
    watchedPan,
    watchedAadhaar,
    watchedCompany,
    watchedCity,
    watchedGstin,
    watchedBio,
    profilePhotoUrl,
  ] = watch([
    "displayName",
    "phone",
    "pan",
    "aadhaar",
    "company",
    "city",
    "gstin",
    "bio",
    "profilePhotoUrl",
  ]);

  const profileCompletion = useMemo(() => {
    const checks = [
      (watchedDisplayName || "").trim(),
      (watchedPhone || "").trim(),
      (watchedPan || "").trim(),
      (watchedAadhaar || "").trim(),
      (watchedCompany || "").trim(),
      (watchedCity || "").trim(),
      (watchedGstin || "").trim(),
      (watchedBio || "").trim(),
      (profilePhotoUrl || "").trim(),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [
    watchedDisplayName,
    watchedPhone,
    watchedPan,
    watchedAadhaar,
    watchedCompany,
    watchedCity,
    watchedGstin,
    watchedBio,
    profilePhotoUrl,
  ]);

  const onPhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhotoError(null);
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setPhotoError(t("sellerPanel.profile.photoInvalidType"));
        return;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setPhotoError(t("sellerPanel.profile.photoTooLarge"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : null;
        setValue("profilePhotoUrl", dataUrl, { shouldDirty: true, shouldValidate: true });
        persistPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [persistPhoto, setValue, t]
  );

  const clearPhoto = useCallback(() => {
    setPhotoError(null);
    setValue("profilePhotoUrl", null, { shouldDirty: true });
    persistPhoto(null);
  }, [persistPhoto, setValue]);

  const onVerificationUpload = useCallback(
    (docType: "aadhaar" | "pan") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setVerificationUploads((prev) => ({ ...prev, [docType]: true }));
    },
    []
  );

  const onSubmit = handleSubmit((data) => {
    saveSellerProfile(email, {
      displayName: data.displayName,
      company: data.company,
      phone: data.phone,
      pan: data.pan,
      aadhaar: data.aadhaar,
      city: data.city,
      gstin: data.gstin,
      bio: data.bio,
      profilePhotoUrl: data.profilePhotoUrl,
    });
    setAccountCreatedIfMissing(email);
    setSaved(true);
    if (profileCompletion === 100) {
      window.alert("Your profile is 100% completed");
    }
    window.setTimeout(() => setSaved(false), 4000);
  });

  const displayInitial = (defaults.displayName || user?.name || "S").trim().charAt(0).toUpperCase() || "S";

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.profile.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.profile.sub")}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-[var(--b2)] bg-[var(--b2-soft)] shadow-inner shadow-[var(--b2)]/30">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-serif text-2xl font-semibold text-[var(--b1-mid)]">
                  {displayInitial}
                </span>
              )}
            </div>
            <div
              className="pointer-events-none absolute -bottom-3 -right-3 h-14 w-14 rounded-full"
              style={{
                background: `conic-gradient(var(--b1) ${profileCompletion * 3.6}deg, var(--b2) 0deg)`,
              }}
            >
              <div className="absolute inset-1 flex items-center justify-center rounded-full bg-[var(--white)] text-[11px] font-semibold text-[var(--b1)]">
                {profileCompletion}%
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-medium text-[var(--b1)]">{t("sellerPanel.profile.photoLabel")}</p>
            <p className="text-xs text-[var(--muted)]">{t("sellerPanel.profile.photoHint")}</p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-2 text-sm font-medium text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)]">
                <span>{t("sellerPanel.profile.photoUpload")}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={onPhotoChange} />
              </label>
              {profilePhotoUrl ? (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="text-sm font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--b1)] hover:underline"
                >
                  {t("sellerPanel.profile.photoRemove")}
                </button>
              ) : null}
            </div>
            {photoError ? <p className="text-xs text-[var(--error)]">{photoError}</p> : null}
            {errors.profilePhotoUrl ? (
              <p className="text-xs text-[var(--error)]">{errors.profilePhotoUrl.message}</p>
            ) : null}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-6 shadow-sm"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--b2-soft)] text-[var(--b1-mid)] ring-1 ring-[var(--b2)]/60">
            <Clock className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          </span>
          <h2 className="font-sans text-base font-semibold text-[var(--b1)]">{t("sellerPanel.profile.activityTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">{t("sellerPanel.profile.lastLogin")}</p>
            <p className="mt-1 font-sans text-sm font-semibold text-[var(--b1)]">
              {formatActivityTimestamp(activity?.lastLoginAt, i18n.language)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">{t("sellerPanel.profile.accountCreated")}</p>
            <p className="mt-1 font-sans text-sm font-semibold text-[var(--b1)]">
              {activity?.accountCreatedAt
                ? formatActivityTimestamp(activity.accountCreatedAt, i18n.language)
                : t("sellerPanel.profile.activityPending")}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="xl:col-span-2 space-y-4 rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] p-6 shadow-sm"
        >
          <h2 className="text-base font-semibold text-[var(--b1)]">{t("sellerPanel.profile.sectionMain")}</h2>
          <input type="hidden" {...register("profilePhotoUrl")} />
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
              {errors.phone ? (
                <span className="mt-1 block text-xs text-[var(--error)]">{errors.phone.message}</span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">PAN</span>
              <input
                {...register("pan")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
              {errors.pan ? (
                <span className="mt-1 block text-xs text-[var(--error)]">{errors.pan.message}</span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[var(--b1)]">Aadhaar</span>
              <input
                {...register("aadhaar")}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
              {errors.aadhaar ? (
                <span className="mt-1 block text-xs text-[var(--error)]">{errors.aadhaar.message}</span>
              ) : null}
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
                Aadhaar Card Upload
              </span>
              {verificationUploads.aadhaar ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                  <span aria-hidden>✔</span>
                  <span>Successfully</span>
                </span>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[var(--warning)]">
                  <span>{t("sellerPanel.profile.pending")}</span>
                  <span className="text-[var(--b1)]">Upload</span>
                  <input type="file" className="sr-only" onChange={onVerificationUpload("aadhaar")} />
                </label>
              )}
            </li>
            <li className="flex items-center justify-between rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--b1-mid)]" />
                PAN Card Upload
              </span>
              {verificationUploads.pan ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                  <span aria-hidden>✔</span>
                  <span>Successfully</span>
                </span>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[var(--warning)]">
                  <span>{t("sellerPanel.profile.pending")}</span>
                  <span className="text-[var(--b1)]">Upload</span>
                  <input type="file" className="sr-only" onChange={onVerificationUpload("pan")} />
                </label>
              )}
            </li>
          </ul>
        </motion.aside>
      </div>
    </section>
  );
};

export default SellerProfilePage;
