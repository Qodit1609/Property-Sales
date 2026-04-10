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
import { useTranslation } from "react-i18next";

const OWNERSHIP: OwnershipType[] = [
  "Freehold",
  "Leasehold",
  "Power of Attorney",
  "Other",
];

const SOIL: SoilType[] = ["Black", "Red", "Alluvial", "Sandy", "Other"];

const SUITABLE: SuitableFor[] = ["Farming", "Resort", "Investment", "Farmhouse"];

const YES_NO_OPTIONS = (
  t: (key: string) => string,
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
    <option value="">{t("postProperty.common.select")}</option>
    <option value="yes">{t("postProperty.common.yes")}</option>
    <option value="no">{t("postProperty.common.no")}</option>
  </select>
);

function FieldLabel({
  title,
  required,
  t,
}: {
  title: string;
  required: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="mb-1 flex items-center justify-between gap-2">
      <label className="block text-sm font-semibold text-[var(--b1)]">{title}</label>
      <span className="text-[11px] font-semibold text-[var(--muted)]">
        {required ? t("postProperty.common.required") : t("postProperty.common.optional")}
      </span>
    </div>
  );
}

export default function PropertyProfileForm() {
  const { t } = useTranslation();
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
        title: t("postProperty.toast.fixRequiredFields"),
        detail: t("postProperty.toast.completePropertyProfile"),
      });
      return;
    }
    dispatch(markStepCompleted("profile"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
    navigate("/post-property/media");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">
        {t("postProperty.profile.stepTitle")}
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("postProperty.profile.stepSubtitle")}
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <FieldLabel title={t("postProperty.profile.totalLandArea")} required t={t} />
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
              placeholder={t("postProperty.profile.totalLandAreaPlaceholder")}
            />
            <select
              value={profile.areaUnit}
              onChange={(e) =>
                dispatch(updateProfileDetails({ areaUnit: e.target.value as AreaUnit }))
              }
              className="w-[140px] rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="acre">{t("postProperty.profile.areaUnitAcre")}</option>
              <option value="hectare">{t("postProperty.profile.areaUnitHectare")}</option>
              <option value="sqft">{t("postProperty.profile.areaUnitSqft")}</option>
            </select>
          </div>
          {showError("totalArea") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.totalArea || "")}</p>
          )}
        </div>

        <div>
          <FieldLabel title={t("postProperty.profile.price")} required t={t} />
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
            placeholder={t("postProperty.profile.pricePlaceholder")}
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
              {t("postProperty.profile.negotiable")}
            </label>
          </div>
          {showError("price") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.price || "")}</p>
          )}
        </div>

        <div>
          <FieldLabel title={t("postProperty.profile.ownershipType")} required t={t} />
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
            <option value="">{t("postProperty.common.select")}</option>
            {OWNERSHIP.map((x) => (
              <option key={x} value={x}>
                {t(`postProperty.options.ownership.${x}`)}
              </option>
            ))}
          </select>
          {showError("ownershipType") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.ownershipType || "")}</p>
          )}
        </div>

        <div>
          <FieldLabel title={t("postProperty.profile.soilType")} required={false} t={t} />
          <select
            value={profile.soilType}
            onChange={(e) =>
              dispatch(updateProfileDetails({ soilType: e.target.value as SoilType }))
            }
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          >
            <option value="">{t("postProperty.common.select")}</option>
            {SOIL.map((x) => (
              <option key={x} value={x}>
                {t(`postProperty.options.soil.${x}`)}
              </option>
            ))}
          </select>
        </div>

        {showResidentialSpecs && (
        <div>
          <FieldLabel title={t("postProperty.profile.bedrooms")} required={requiresResidentialSpecs} t={t} />
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
            placeholder={t("postProperty.profile.bedroomsPlaceholder")}
          />
          {showError("bedrooms") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.bedrooms || "")}</p>
          )}
        </div>
        )}

        {showResidentialSpecs && (
        <div>
          <FieldLabel title={t("postProperty.profile.bathrooms")} required={requiresResidentialSpecs} t={t} />
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
            placeholder={t("postProperty.profile.bathroomsPlaceholder")}
          />
          {showError("bathrooms") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.bathrooms || "")}</p>
          )}
        </div>
        )}

        {(showResidentialSpecs || showCommercialSpecs) && (
        <div>
          <FieldLabel title={t("postProperty.profile.floor")} required={requiresResidentialSpecs} t={t} />
          <Input
            value={profile.floor}
            onBlur={() => setTouched((p) => ({ ...p, floor: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ floor: e.target.value }))}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder={t("postProperty.profile.floorPlaceholder")}
          />
          {showError("floor") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.floor || "")}</p>
          )}
        </div>
        )}

        {(showResidentialSpecs || showCommercialSpecs) && (
        <div>
          <FieldLabel title={t("postProperty.profile.furnishing")} required={requiresResidentialSpecs} t={t} />
          <Input
            value={profile.furnishing}
            onBlur={() => setTouched((p) => ({ ...p, furnishing: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ furnishing: e.target.value }))}
            className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            placeholder={t("postProperty.profile.furnishingPlaceholder")}
          />
          {showError("furnishing") && (
            <p className="mt-1 text-xs text-[var(--error)]">{t(errors.furnishing || "")}</p>
          )}
        </div>
        )}

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">
            {t("postProperty.profile.availability")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "waterAvailability", label: t("postProperty.profile.waterAvailable") },
              { key: "electricityAvailability", label: t("postProperty.profile.electricityAvailable") },
              { key: "roadAccess", label: t("postProperty.profile.roadAccess") },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  t,
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">{t("postProperty.profile.features")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "parking", label: t("postProperty.profile.parking") },
              { key: "powerBackup", label: t("postProperty.profile.powerBackup") },
              { key: "security", label: t("postProperty.profile.security") },
              { key: "constructionAllowed", label: t("postProperty.profile.constructionAllowed") },
              { key: "farmhouseBuilt", label: t("postProperty.profile.farmhouseBuilt") },
              { key: "gated", label: t("postProperty.profile.gated") },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  t,
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">{t("postProperty.profile.legalDetails")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "landRegistry", label: t("postProperty.profile.landRegistry") },
              { key: "ownershipDocs", label: t("postProperty.profile.ownershipDocs") },
              { key: "encumbrance", label: t("postProperty.profile.encumbranceFree") },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  t,
                  profile[x.key as keyof ProfileDetails] as boolean | null,
                  (v) =>
                    dispatch(updateProfileDetails({ [x.key]: v } as Partial<ProfileDetails>))
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">{t("postProperty.profile.waterAndFarming")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "borewell", label: t("postProperty.profile.borewell") },
              { key: "irrigation", label: t("postProperty.profile.irrigation") },
              { key: "irrigationSupport", label: t("postProperty.profile.irrigationSupport") },
            ].map((x) => (
              <label
                key={x.key}
                className="flex items-center justify-between rounded-xl border border-[var(--b2)] px-4 py-3 text-sm text-[var(--b1)]"
              >
                <span className="font-medium">{x.label}</span>
                {YES_NO_OPTIONS(
                  t,
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
              placeholder={t("postProperty.profile.borewellDepthPlaceholder")}
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
              placeholder={t("postProperty.profile.annualRainfallPlaceholder")}
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
              placeholder={t("postProperty.profile.soilQualityIndexPlaceholder")}
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
              placeholder={t("postProperty.profile.farmingPercentagePlaceholder")}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">{t("postProperty.profile.locationInsights")}</p>
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
              placeholder={t("postProperty.profile.airportDistancePlaceholder")}
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
              placeholder={t("postProperty.profile.railwayDistancePlaceholder")}
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
              placeholder={t("postProperty.profile.highwayDistancePlaceholder")}
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
              placeholder={t("postProperty.profile.cityCenterDistancePlaceholder")}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">{t("postProperty.profile.investment")}</p>
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
              placeholder={t("postProperty.profile.roiPlaceholder")}
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
              placeholder={t("postProperty.profile.appreciationRatePlaceholder")}
              className="w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[var(--b1)] mb-2">
            {t("postProperty.profile.suitableFor")}
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
                  {t(`postProperty.options.suitableFor.${x}`)}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <FieldLabel title={t("postProperty.profile.description")} required t={t} />
          <textarea
            value={profile.description}
            onBlur={() => setTouched((p) => ({ ...p, description: true }))}
            onChange={(e) => dispatch(updateProfileDetails({ description: e.target.value }))}
            rows={4}
            placeholder={t("postProperty.profile.descriptionPlaceholder")}
            className={`w-full rounded-md border px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)] ${
              showError("description") ? "border-[var(--error)]" : "border-[var(--b2)]"
            }`}
          />
          {showError("description") && (
            <p className="mt-1 text-xs text-[var(--error)]">
              {t(errors.description || "")}
            </p>
          )}
        </div>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/location")}
        onNext={onNext}
        nextLabel={t("postProperty.common.continue")}
      />
    </div>
  );
}

