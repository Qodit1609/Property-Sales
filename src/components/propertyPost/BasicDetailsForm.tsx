import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  markStepCompleted,
  saveDraftNow,
  updateBasicDetails,
} from "../../features/postProperty/postPropertySlice";
import type {
  ListingType,
  PropertyCategory,
} from "../../features/postProperty/postPropertyTypes";
import { validateBasicDetails } from "../../features/postProperty/postPropertyValidation";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import { Input, Button } from "@/components/common";
import { useTranslation } from "react-i18next";

const CATEGORY_OPTIONS: PropertyCategory[] = [
  "Agriculture Land",
  "Farmhouse",
  "Agri Resort",
  "Residential",
  "Commercial",
];

/** Subtypes per category — each value matches the API propertyType enum. */
const PROPERTY_TYPES_BY_CATEGORY: Record<PropertyCategory, string[]> = {
  "Agriculture Land": [
    "Agriculture Land",
    "Farmland",
    "Farmhouse",
    "Other",
  ],
  Farmhouse: [
    "Farmhouse",
    "Farmland",
    "Villa",
    "House",
    "Resort",
    "Other",
  ],
  "Agri Resort": ["Resort", "Farmhouse", "Commercial", "Villa", "Other"],
  Residential: ["Plot", "House", "Apartment", "Flat", "Villa"],
  Commercial: ["Commercial", "Plot", "Flat", "Apartment", "Other"],
};

export default function BasicDetailsForm() {
  const { t } = useTranslation();
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basic = useAppSelector((s) => s.postProperty.basicDetails);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const propertyTypeOptions = useMemo(() => {
    if (!basic.category) return [];
    return PROPERTY_TYPES_BY_CATEGORY[basic.category];
  }, [basic.category]);

  const errors = useMemo(() => validateBasicDetails(basic), [basic]);

  const showError = (key: string) => {
    return Boolean(touched[key] && (errors as Record<string, string | undefined>)[key]);
  };

  const onNext = () => {
    setTouched({
      listingType: true,
      category: true,
      propertyType: true,
      title: true,
      contactName: true,
      contactEmail: true,
      contactMobile: true,
    });
    if (Object.keys(errors).length > 0) {
      pushToast({
        kind: "error",
        title: t("postProperty.toast.fixRequiredFields"),
        detail: t("postProperty.toast.completeBasicDetails"),
      });
      return;
    }
    dispatch(markStepCompleted("basic"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
    navigate("/post-property/location");
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--b1)]">
            {t("postProperty.basic.stepTitle")}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("postProperty.basic.stepSubtitle")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            {t("postProperty.basic.listingType")} *
          </label>
          <select
            value={basic.listingType}
            onBlur={() => setTouched((p) => ({ ...p, listingType: true }))}
            onChange={(e) =>
              dispatch(
                updateBasicDetails({ listingType: e.target.value as ListingType })
              )
            }
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("listingType") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          >
            <option value="">{t("postProperty.common.select")}</option>
            <option value="sell">{t("postProperty.basic.sell")}</option>
            <option value="rent">{t("postProperty.basic.rentLease")}</option>
          </select>
          {showError("listingType") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.listingType || "")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            {t("postProperty.basic.propertyCategory")} *
          </label>
          <select
            value={basic.category}
            onBlur={() => setTouched((p) => ({ ...p, category: true }))}
            onChange={(e) => {
              const category = e.target.value as PropertyCategory | "";
              dispatch(
                updateBasicDetails({
                  category,
                  propertyType: "",
                })
              );
            }}
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("category") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          >
            <option value="">{t("postProperty.common.select")}</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {t(`postProperty.options.category.${c}`)}
              </option>
            ))}
          </select>
          {showError("category") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.category || "")}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            {t("postProperty.basic.propertyType")} *
          </label>
          <select
            value={basic.propertyType}
            disabled={!basic.category}
            onBlur={() => setTouched((p) => ({ ...p, propertyType: true }))}
            onChange={(e) =>
              dispatch(updateBasicDetails({ propertyType: e.target.value }))
            }
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] disabled:opacity-70 ${
              showError("propertyType") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          >
            <option value="">
              {basic.category ? t("postProperty.common.select") : t("postProperty.basic.selectCategoryFirst")}
            </option>
            {propertyTypeOptions.map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {t(`postProperty.options.propertyType.${typeOption}`)}
              </option>
            ))}
          </select>
          {showError("propertyType") && (
            <p className="mt-1 text-xs text-[var(--error)]">
              {t(errors.propertyType || "")}
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            {t("postProperty.basic.listingTitle")} *
          </label>
          <Input
            value={basic.title}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            onChange={(e) => dispatch(updateBasicDetails({ title: e.target.value }))}
            placeholder={t("postProperty.basic.listingTitlePlaceholder")}
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("title") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          />
          {showError("title") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.title || "")}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            {t("postProperty.basic.shortDescription")}
          </label>
          <Input
            value={basic.shortDescription}
            onChange={(e) =>
              dispatch(updateBasicDetails({ shortDescription: e.target.value }))
            }
            placeholder={t("postProperty.basic.shortDescriptionPlaceholder")}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--b1)]">
          {t("postProperty.basic.contactDetails")}
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("postProperty.basic.contactDetailsHint")}
        </p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              {t("postProperty.basic.name")} *
            </label>
            <Input
              value={basic.contactName}
              onBlur={() => setTouched((p) => ({ ...p, contactName: true }))}
              onChange={(e) =>
                dispatch(updateBasicDetails({ contactName: e.target.value }))
              }
              className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
                showError("contactName") ? "border-[var(--error)]" : "border-[var(--b2)]"
              }`}
              placeholder={t("postProperty.basic.yourName")}
            />
            {showError("contactName") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {t(errors.contactName || "")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              {t("postProperty.basic.email")} *
            </label>
            <Input
              value={basic.contactEmail}
              onBlur={() => setTouched((p) => ({ ...p, contactEmail: true }))}
              onChange={(e) =>
                dispatch(updateBasicDetails({ contactEmail: e.target.value }))
              }
              className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
                showError("contactEmail") ? "border-[var(--error)]" : "border-[var(--b2)]"
              }`}
              placeholder={t("postProperty.basic.emailPlaceholder")}
            />
            {showError("contactEmail") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {t(errors.contactEmail || "")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              {t("postProperty.basic.mobileNumber")} *
            </label>
            <div className="flex gap-2">
              <Input
                value={basic.contactMobile}
                onBlur={() => setTouched((p) => ({ ...p, contactMobile: true }))}
                onChange={(e) =>
                  dispatch(updateBasicDetails({ contactMobile: e.target.value }))
                }
                className={`flex-1 rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
                  showError("contactMobile")
                    ? "border-[var(--error)]"
                    : "border-[var(--b2)]"
                }`}
                placeholder={t("postProperty.basic.mobilePlaceholder")}
              />
              <Button
                type="button"
                onClick={() =>
                  pushToast({
                    kind: "info",
                    title: t("postProperty.toast.otpVerification"),
                    detail: t("postProperty.toast.otpHookReady"),
                  })
                }
                className="rounded-md border border-[var(--b2)] px-3 py-2 text-xs font-semibold hover:bg-[var(--b1-mid)] transition"
              >
                {t("postProperty.basic.verify")}
              </Button>
            </div>
            {showError("contactMobile") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {t(errors.contactMobile || "")}
              </p>
            )}
          </div>
        </div>
      </div>

      <FormActions onNext={onNext} nextLabel={t("postProperty.common.continue")} />
    </div>
  );
}

