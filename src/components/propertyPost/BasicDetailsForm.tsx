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
        title: "Fix required fields",
        detail: "Please complete Basic Details before continuing.",
      });
      return;
    }
    dispatch(markStepCompleted("basic"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: "Draft saved" });
    navigate("/post-property/location");
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--b1)]">
            Step 1: Basic Details
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Start with listing basics and your contact info.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Listing type *
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
            <option value="">Select</option>
            <option value="sell">Sell</option>
            <option value="rent">Rent/Lease</option>
          </select>
          {showError("listingType") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.listingType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Property category *
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
            <option value="">Select</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {showError("category") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.category}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Property type *
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
              {basic.category ? "Select" : "Select a category first"}
            </option>
            {propertyTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {showError("propertyType") && (
            <p className="mt-1 text-xs text-[var(--error)]">
              {errors.propertyType}
            </p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Listing title *
          </label>
          <Input
            value={basic.title}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            onChange={(e) => dispatch(updateBasicDetails({ title: e.target.value }))}
            placeholder="e.g. 5 Acre irrigated land near highway"
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("title") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          />
          {showError("title") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.title}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Short description
          </label>
          <Input
            value={basic.shortDescription}
            onChange={(e) =>
              dispatch(updateBasicDetails({ shortDescription: e.target.value }))
            }
            placeholder="One-line summary shown in preview cards"
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-[var(--b1)]">
          Contact details
        </h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          These will be shown to interested buyers (editable).
        </p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              Name *
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
              placeholder="Your name"
            />
            {showError("contactName") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {errors.contactName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              Email *
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
              placeholder="you@example.com"
            />
            {showError("contactEmail") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {errors.contactEmail}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
              Mobile number *
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
                placeholder="10-digit mobile"
              />
              <Button
                type="button"
                onClick={() =>
                  pushToast({
                    kind: "info",
                    title: "OTP verification",
                    detail: "Hook is ready—backend OTP can be integrated next.",
                  })
                }
                className="rounded-md border border-[var(--b2)] px-3 py-2 text-xs font-semibold hover:bg-[var(--b1-mid)] transition"
              >
                Verify
              </Button>
            </div>
            {showError("contactMobile") && (
              <p className="mt-1 text-xs text-[var(--error)]">
                {errors.contactMobile}
              </p>
            )}
          </div>
        </div>
      </div>

      <FormActions onNext={onNext} nextLabel="Continue" />
    </div>
  );
}

