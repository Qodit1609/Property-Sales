import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  markStepCompleted,
  saveDraftNow,
  updateProfileDetails,
} from "../../features/postProperty/postPropertySlice";
import type {
  BasicDetails,
  AreaUnit,
  ProfileDetails,
  OwnershipType,
  SoilType,
  SuitableFor,
} from "../../features/postProperty/postPropertyTypes";
import { validateProfileDetails } from "../../features/postProperty/postPropertyValidation";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import { Input, Button } from "@/components/common";

const OWNERSHIP: OwnershipType[] = [
  "Freehold",
  "Leasehold",
  "Power of Attorney",
  "Other",
];

const SOIL: SoilType[] = ["Black", "Red", "Alluvial", "Sandy", "Other"];

const SUITABLE: SuitableFor[] = ["Farming", "Resort", "Investment", "Farmhouse"];

const YES_NO_OPTIONS = (
  value: boolean | null,
  onChange: (value: boolean | null) => void,
) => (
  <select
    value={value == null ? "" : value ? "yes" : "no"}
    onChange={(e) => {
      const next =
        e.target.value === "" ? null : e.target.value === "yes" ? true : false;
      onChange(next);
    }}
    className="rounded-md border border-[var(--b2)] px-2 py-1 text-xs bg-[var(--white)]"
  >
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
);

function FieldLabel({
  title,
  required,
}: {
  title: string;
  required: boolean;
}) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2">
      <label className="block text-sm font-semibold text-[var(--b1)]">{title}</label>
      <span className="text-[11px] font-semibold text-[var(--muted)]">
        {required ? "Required" : "Optional"}
      </span>
    </div>
  );
}

export default function PropertyProfileForm() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.postProperty.profileDetails);
  const basic = useAppSelector((s) => s.postProperty.basicDetails);

  const isAgricultureLandProfile =
    basic.category === "Agriculture Land" ||
    basic.propertyType === "Agriculture Land" ||
    basic.propertyType === "Farmland" ||
    basic.propertyType === "Plot";
  const requiresResidentialSpecs =
    !isAgricultureLandProfile &&
    ["House", "Apartment", "Flat", "Villa", "Farmhouse", "Resort"].includes(
      basic.propertyType
    );
  const showResidentialSpecs =
    !isAgricultureLandProfile &&
    (requiresResidentialSpecs ||
      basic.category === "Residential" ||
      basic.category === "Farmhouse" ||
      basic.category === "Agri Resort");
  const showCommercialSpecs =
    !isAgricultureLandProfile &&
    (basic.category === "Commercial" || basic.propertyType === "Commercial");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errors = useMemo(
    () => validateProfileDetails(profile, basic as BasicDetails),
    [basic, profile]
  );
  const showError = (key: string) =>
    Boolean(touched[key] && (errors as Record<string, string | undefined>)[key]);

  const toggleSuitable = (key: SuitableFor) => {
    const next = profile.suitableFor.includes(key)
      ? profile.suitableFor.filter((x) => x !== key)
      : [...profile.suitableFor, key];
    dispatch(updateProfileDetails({ suitableFor: next }));
  };

  const onNext = () => {
    const nextTouched: Record<string, boolean> = {
      totalArea: true,
      price: true,
      ownershipType: true,
      description: true,
    };
    if (requiresResidentialSpecs) {
      nextTouched.bedrooms = true;
      nextTouched.bathrooms = true;
      nextTouched.floor = true;
      nextTouched.furnishing = true;
    }
    setTouched(nextTouched);
    if (Object.keys(errors).length > 0) {
      pushToast({
        kind: "error",
        title: "Fix required fields",
        detail: "Please complete Property Profile before continuing.",
      });
      return;
    }
    dispatch(markStepCompleted("profile"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: "Draft saved" });
    navigate("/post-property/media");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">
        Step 3: Property Profile
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Add key details that influence buyer decisions.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <FieldLabel title="Total land area" required />
          <div className="flex gap-2">
            <Input
              value={profile.totalArea ?? ""}
              onBlur={() => setTouched((p) => ({ ...p, totalArea: true }))}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    totalArea: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              className={`flex-1 rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
                showError("totalArea") ? "border-[var(--error)]" : "border-[var(--b2)]"
              }`}
              placeholder="e.g. 5"
            />
            <select
              value={profile.areaUnit}
              onChange={(e) =>
                dispatch(updateProfileDetails({ areaUnit: e.target.value as AreaUnit }))
              }
              className="w-[140px] rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
              <option value="sqft">Sq. ft</option>
            </select>
          </div>
          {showError("totalArea") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.totalArea}</p>
          )}
        </div>

        <div>
          <FieldLabel title="Price" required />
          <Input
            value={profile.price ?? ""}
            onBlur={() => setTouched((p) => ({ ...p, price: true }))}
            onChange={(e) =>
              dispatch(
                updateProfileDetails({
                  price: e.target.value === "" ? null : Number(e.target.value),
                })
              )
            }
            type="number"
            min={0}
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("price") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
            placeholder="e.g. 4500000"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              id="negotiable"
              type="checkbox"
              checked={profile.negotiable}
              onChange={(e) => dispatch(updateProfileDetails({ negotiable: e.target.checked }))}
              className="h-4 w-4 cursor-pointer accent-[var(--b1)]"
            />
            <label htmlFor="negotiable" className="text-sm text-[var(--b1)]">
              Negotiable
            </label>
          </div>
          {showError("price") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.price}</p>
          )}
        </div>

        <div>
          <FieldLabel title="Ownership type" required />
          <select
            value={profile.ownershipType}
            onBlur={() => setTouched((p) => ({ ...p, ownershipType: true }))}
            onChange={(e) =>
              dispatch(updateProfileDetails({ ownershipType: e.target.value as OwnershipType }))
            }
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("ownershipType")
                ? "border-[var(--error)]"
                : "border-[var(--b2)]"
            }`}
          >
            <option value="">Select</option>
            {OWNERSHIP.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
          {showError("ownershipType") && (
            <p className="mt-1 text-xs text-[var(--error)]">
              {errors.ownershipType}
            </p>
          )}
        </div>

        <div>
          <FieldLabel title="Soil type" required={false} />
          <select
            value={profile.soilType}
            onChange={(e) =>
              dispatch(updateProfileDetails({ soilType: e.target.value as SoilType }))
            }
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          >
            <option value="">Select</option>
            {SOIL.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        {showResidentialSpecs && (
        <div>
          <FieldLabel title="Bedrooms" required={requiresResidentialSpecs} />
          <Input
            value={profile.bedrooms ?? ""}
            onBlur={() => setTouched((p) => ({ ...p, bedrooms: true }))}
            onChange={(e) =>
              dispatch(
                updateProfileDetails({
                  bedrooms: e.target.value === "" ? null : Number(e.target.value),
                })
              )
            }
            type="number"
            min={0}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder="e.g. 3"
          />
          {showError("bedrooms") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.bedrooms}</p>
          )}
        </div>
        )}

        {showResidentialSpecs && (
        <div>
          <FieldLabel title="Bathrooms" required={requiresResidentialSpecs} />
          <Input
            value={profile.bathrooms ?? ""}
            onBlur={() => setTouched((p) => ({ ...p, bathrooms: true }))}
            onChange={(e) =>
              dispatch(
                updateProfileDetails({
                  bathrooms: e.target.value === "" ? null : Number(e.target.value),
                })
              )
            }
            type="number"
            min={0}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder="e.g. 2"
          />
          {showError("bathrooms") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.bathrooms}</p>
          )}
        </div>
        )}

        {(showResidentialSpecs || showCommercialSpecs) && (
        <div>
          <FieldLabel title="Floor" required={requiresResidentialSpecs} />
          <Input
            value={profile.floor}
            onBlur={() => setTouched((p) => ({ ...p, floor: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ floor: e.target.value }))}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder="e.g. Ground / 2nd"
          />
          {showError("floor") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.floor}</p>
          )}
        </div>
        )}

        {(showResidentialSpecs || showCommercialSpecs) && (
        <div>
          <FieldLabel title="Furnishing" required={requiresResidentialSpecs} />
          <Input
            value={profile.furnishing}
            onBlur={() => setTouched((p) => ({ ...p, furnishing: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ furnishing: e.target.value }))}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder="e.g. Semi-furnished"
          />
          {showError("furnishing") && (
            <p className="mt-1 text-xs text-[var(--error)]">{errors.furnishing}</p>
          )}
        </div>
        )}

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">
            Availability
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "waterAvailability", label: "Water available" },
              { key: "electricityAvailability", label: "Electricity available" },
              { key: "roadAccess", label: "Road access" },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">Features</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "parking", label: "Parking" },
              { key: "powerBackup", label: "Power backup" },
              { key: "security", label: "Security" },
              { key: "constructionAllowed", label: "Construction allowed" },
              { key: "farmhouseBuilt", label: "Farmhouse built" },
              { key: "gated", label: "Gated" },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">Legal details</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "landRegistry", label: "Land registry" },
              { key: "ownershipDocs", label: "Ownership docs" },
              { key: "encumbrance", label: "Encumbrance free" },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">Water & farming</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "borewell", label: "Borewell" },
              { key: "irrigation", label: "Irrigation" },
              { key: "irrigationSupport", label: "Irrigation support" },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={profile.borewellDepth ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    borewellDepth: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Borewell depth (ft)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.annualRainfall ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    annualRainfall: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Annual rainfall (mm)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.soilQualityIndex ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    soilQualityIndex: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Soil quality index"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.farmingPercentage ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    farmingPercentage: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Farming %"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">Location insights</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={profile.airportDistance ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    airportDistance: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Airport distance (km)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.railwayDistance ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    railwayDistance: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Railway distance (km)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.highwayDistance ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    highwayDistance: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="Highway distance (km)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.cityCenterDistance ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    cityCenterDistance: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              min={0}
              placeholder="City center distance (km)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">Investment</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              value={profile.roiPercent ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    roiPercent: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              placeholder="Expected ROI (%)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
            <Input
              value={profile.appreciationRate ?? ""}
              onChange={(e) =>
                dispatch(
                  updateProfileDetails({
                    appreciationRate: e.target.value === "" ? null : Number(e.target.value),
                  })
                )
              }
              type="number"
              placeholder="Appreciation rate (%)"
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">
            Suitable for
          </p>
          <div className="flex flex-wrap gap-2">
            {SUITABLE.map((x) => {
              const active = profile.suitableFor.includes(x);
              return (
                <Button
                  key={x}
                  type="button"
                  onClick={() => toggleSuitable(x)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-[var(--b1-mid)] bg-[var(--b2-soft)] text-[var(--b1)]"
                      : "border-[var(--b2)] bg-[var(--b1)] text-[var(--fg)] hover:bg-[var(--b2-soft)] hover:text-[var(--b1)]"
                  }`}
                >
                  {x}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <FieldLabel title="Description" required />
          <textarea
            value={profile.description}
            onBlur={() => setTouched((p) => ({ ...p, description: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ description: e.target.value }))}
            rows={4}
            placeholder="Share highlights like soil quality, approach road, nearby highway, water source, etc."
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("description") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          />
          {showError("description") && (
            <p className="mt-1 text-xs text-[var(--error)]">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/location")}
        onNext={onNext}
        nextLabel="Continue"
      />
    </div>
  );
}

