import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  markStepCompleted,
  saveDraftNow,
  updateProfileDetails,
} from "../../features/postProperty/postPropertySlice";
import type {
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

export default function PropertyProfileForm() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.postProperty.profileDetails);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errors = useMemo(() => validateProfileDetails(profile), [profile]);
  const showError = (key: string) =>
    Boolean(touched[key] && (errors as Record<string, string | undefined>)[key]);

  const toggleSuitable = (key: SuitableFor) => {
    const next = profile.suitableFor.includes(key)
      ? profile.suitableFor.filter((x) => x !== key)
      : [...profile.suitableFor, key];
    dispatch(updateProfileDetails({ suitableFor: next }));
  };

  const onNext = () => {
    setTouched({
      totalArea: true,
      price: true,
      ownershipType: true,
      description: true,
    });
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
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Total land area *
          </label>
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
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Price *
          </label>
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
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Ownership type *
          </label>
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
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Soil type
          </label>
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
                <select
                  value={
                    profile[x.key as keyof ProfileDetails] == null
                      ? ""
                      : (profile[x.key as keyof ProfileDetails] as unknown as boolean)
                      ? "yes"
                      : "no"
                  }
                  onChange={(e) => {
                    const v =
                      e.target.value === ""
                        ? null
                        : e.target.value === "yes"
                        ? true
                        : false;
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>));
                  }}
                  className="rounded-md border border-[var(--b2)] px-2 py-1 text-xs bg-[var(--white)]"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
            ))}
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
          <label className="block text-sm font-semibold text-[var(--b1)] mb-1">
            Description *
          </label>
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

