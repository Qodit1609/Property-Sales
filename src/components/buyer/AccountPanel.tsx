import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useBuyerActivityLocal } from "../../hooks/useBuyerActivityLocal";
import { useBuyerProfileLocal } from "../../hooks/useBuyerProfileLocal";
import { loadBuyerProfile, saveBuyerProfile } from "../../lib/buyerProfileStorage";
import { Button, Input } from "@/components/common";

import type { BuyerPreference } from "../../features/buyer/buyerTypes";

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

interface AccountPanelProps {
  onUpdatePreferences?: (prefs: Partial<BuyerPreference>) => void;
}

const AccountPanel: React.FC<AccountPanelProps> = ({
  onUpdatePreferences,
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { preferences } = useAppSelector((state) => state.buyer);
  const email = user?.email;
  const storedProfile = useBuyerProfileLocal(email);
  const activity = useBuyerActivityLocal(email);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const profilePhotoUrl = storedProfile?.profilePhotoUrl ?? null;

  const displayInitial = useMemo(() => {
    const n = (user?.name ?? "B").trim();
    return n.charAt(0).toUpperCase() || "B";
  }, [user?.name]);

  const persistPhoto = useCallback(
    (nextUrl: string | null) => {
      const prev = loadBuyerProfile(email) ?? {};
      saveBuyerProfile(email, { ...prev, profilePhotoUrl: nextUrl });
    },
    [email]
  );

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
        if (dataUrl) persistPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [persistPhoto, t]
  );

  const clearPhoto = useCallback(() => {
    setPhotoError(null);
    persistPhoto(null);
  }, [persistPhoto]);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--b2)] bg-[var(--b2-soft)] shadow-inner shadow-[var(--b2)]/30 sm:mx-0">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-serif text-2xl font-semibold text-[var(--b1-mid)]">
                {displayInitial}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <p className="font-serif text-sm font-semibold text-[var(--b1)]">
              {t("sellerPanel.profile.photoLabel")}
            </p>
            <p className="text-xs text-[var(--muted)]">
              Shown in your buyer sidebar. JPG or PNG, max about 1.5 MB.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-2 text-sm font-medium text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)]">
                <span>{t("sellerPanel.profile.photoUpload")}</span>
                <input type="file" accept="image/jpeg,image/png,image/*" className="sr-only" onChange={onPhotoChange} />
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
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--b2-soft)] text-[var(--b1-mid)] ring-1 ring-[var(--b2)]/60">
            <Clock className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          </span>
          <h2 className="pt-0.5 font-sans text-base font-semibold text-[var(--b1)]">
            {t("sellerPanel.profile.activityTitle")}
          </h2>
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

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)]">
        {/* Profile Section */}
        <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            Profile details
          </h2>

          <div className="space-y-3 text-xs text-[var(--b1)]">
            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Full name
              </p>
              <p className="mt-0.5 rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2 text-sm">
                {user?.name ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Email
              </p>
              <p className="mt-0.5 rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2 text-sm">
                {user?.email ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Role
              </p>
              <p className="mt-0.5 inline-flex rounded-full bg-[var(--b2-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--b1-mid)]">
                Buyer
              </p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--b1)]">
                Buyer preferences
              </h2>
              <p className="text-[11px] text-[var(--muted)]">
                Used to personalize recommendations and alerts.
              </p>
            </div>
          </div>

          <form
            className="space-y-3 text-xs text-[var(--b1)]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">
                Preferred locations
              </label>

              <Input
                defaultValue={preferences.locations.join(", ")}
                placeholder="E.g. Indore bypass, Mhow, Rau, Ujjain road"
                className="mt-1 text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-medium text-[var(--muted)]">
                  Budget from (₹)
                </label>

                <Input
                  type="number"
                  defaultValue={preferences.minPrice}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[var(--muted)]">
                  Budget to (₹)
                </label>

                <Input
                  type="number"
                  defaultValue={preferences.maxPrice}
                  className="mt-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">
                Property focus
              </label>

              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Agriculture land",
                  "Farmhouse",
                  "Resort",
                  "Agri resort",
                ].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="ghost"
                    className="text-[11px] px-3 py-1 rounded-full bg-[var(--b2-soft)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)]"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <Button
                type="button"
                onClick={() =>
                  onUpdatePreferences?.({
                    /* hook for future wiring */
                  })
                }
                variant="primary"
                className="text-[11px] px-4 py-2"
              >
                Save preference blueprint
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPanel;
