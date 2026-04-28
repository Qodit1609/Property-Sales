import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useBuyerActivityLocal } from "../../hooks/useBuyerActivityLocal";
import { useBuyerProfileLocal } from "../../hooks/useBuyerProfileLocal";
import {
  loadBuyerProfile,
  saveBuyerProfile,
  setBuyerAccountCreatedIfMissing,
} from "../../lib/buyerProfileStorage";
import { Button, Input } from "@/components/common";
import CustomAlert from "@/components/common/CustomAlert";

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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [completionAlertOpen, setCompletionAlertOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    emailAddress: "",
    mobileNumber: "",
    occupation: "",
    gender: "",
  });

  const profilePhotoUrl = storedProfile?.profilePhotoUrl ?? null;
  const profileCompletion = useMemo(() => {
    const checks = [
      profileForm.fullName.trim(),
      profileForm.emailAddress.trim(),
      profileForm.mobileNumber.trim(),
      profileForm.occupation.trim(),
      profileForm.gender.trim(),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [profileForm]);

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

  useEffect(() => {
    if (profileCompletion !== 100) return;
    setBuyerAccountCreatedIfMissing(email);
  }, [email, profileCompletion]);

  useEffect(() => {
    setProfileForm({
      fullName: (user?.name ?? "").trim(),
      emailAddress: (user?.email ?? "").trim(),
      mobileNumber: (storedProfile?.mobileNumber ?? "").trim(),
      occupation: (storedProfile?.occupation ?? "").trim(),
      gender: (storedProfile?.gender ?? "").trim(),
    });
  }, [
    storedProfile?.gender,
    storedProfile?.mobileNumber,
    storedProfile?.occupation,
    user?.email,
    user?.name,
  ]);

  const handleProfileChange = useCallback(
    (field: "fullName" | "emailAddress" | "mobileNumber" | "occupation" | "gender", value: string) => {
      setProfileForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleProfileEditToggle = useCallback(() => {
    if (!isEditingProfile) {
      setIsEditingProfile(true);
      return;
    }
    const prev = loadBuyerProfile(email) ?? {};
    saveBuyerProfile(email, {
      ...prev,
      mobileNumber: profileForm.mobileNumber.trim(),
      occupation: profileForm.occupation.trim(),
      gender: profileForm.gender.trim(),
    });
    if (profileCompletion === 100) {
      setCompletionAlertOpen(true);
    }
    setIsEditingProfile(false);
  }, [email, isEditingProfile, profileCompletion, profileForm.gender, profileForm.mobileNumber, profileForm.occupation]);

  const handleCancelProfileEdit = useCallback(() => {
    setProfileForm({
      fullName: (user?.name ?? "").trim(),
      emailAddress: (user?.email ?? "").trim(),
      mobileNumber: (storedProfile?.mobileNumber ?? "").trim(),
      occupation: (storedProfile?.occupation ?? "").trim(),
      gender: (storedProfile?.gender ?? "").trim(),
    });
    setIsEditingProfile(false);
  }, [storedProfile?.gender, storedProfile?.mobileNumber, storedProfile?.occupation, user?.email, user?.name]);

  return (
    <>
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className="rounded-2xl border border-[var(--b2)]/90 bg-[var(--white)] p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative mx-auto h-20 w-20 shrink-0 sm:mx-0">
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              Profile details
            </h2>
            <div className="flex items-center gap-2">
              {isEditingProfile ? (
                <Button type="button" variant="ghost" className="text-[11px] px-3 py-1.5" onClick={handleCancelProfileEdit}>
                  Cancel
                </Button>
              ) : null}
              <Button type="button" variant="primary" className="text-[11px] px-3 py-1.5" onClick={handleProfileEditToggle}>
                {isEditingProfile ? "Save" : "Edit"}
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[var(--b1)]">
            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Full name
              </p>
              <Input
                value={profileForm.fullName}
                readOnly
                className="mt-1 text-sm bg-[var(--b2-soft)]"
              />
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Email
              </p>
              <Input
                value={profileForm.emailAddress}
                readOnly
                className="mt-1 text-sm bg-[var(--b2-soft)]"
              />
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Mobile number
              </p>
              <Input
                value={profileForm.mobileNumber}
                onChange={(e) => handleProfileChange("mobileNumber", e.target.value)}
                onFocus={() => {
                  if (!isEditingProfile) setIsEditingProfile(true);
                }}
                placeholder="Enter mobile number"
                readOnly={!isEditingProfile}
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Occupation
              </p>
              <Input
                value={profileForm.occupation}
                onChange={(e) => handleProfileChange("occupation", e.target.value)}
                onFocus={() => {
                  if (!isEditingProfile) setIsEditingProfile(true);
                }}
                placeholder="Enter occupation"
                readOnly={!isEditingProfile}
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <p className="text-[11px] font-medium text-[var(--muted)]">
                Gender
              </p>
              <select
                value={profileForm.gender}
                onChange={(e) => handleProfileChange("gender", e.target.value)}
                onFocus={() => {
                  if (!isEditingProfile) setIsEditingProfile(true);
                }}
                className="mt-1 w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] outline-none transition focus:border-[var(--b1)]"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
    <CustomAlert
      open={completionAlertOpen}
      title="Profile Completed"
      message="Your profile is 100% completed"
      onConfirm={() => setCompletionAlertOpen(false)}
    />
    </>
  );
};

export default AccountPanel;
