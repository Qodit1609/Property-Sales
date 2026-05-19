import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { translateSoilType } from "@/lib/i18nHelpers";
import { Button, Input } from "@/components/common";
import {
  createAgentPropertyId,
  useAgentCollection,
} from "./AgentCollectionContext";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useAgentProfileLocal } from "./useAgentProfileLocal";

const PROPERTY_SIZE_UNITS = ["Acre", "Hectare"] as const;
const SOIL_TYPE_OPTIONS = [
  "",
  "Sandy",
  "Clay",
  "Silty",
  "Loamy",
  "Peaty",
  "Chalky",
  "Black",
  "Red",
  "Alluvial",
  "Laterite",
] as const;

const parsePropertySize = (value: string): { size: string; unit: string } => {
  const trimmed = value.trim();
  if (!trimmed) return { size: "", unit: "Acre" };
  const parts = trimmed.split(/\s+/);
  const possibleUnit = parts.slice(1).join(" ");
  if (PROPERTY_SIZE_UNITS.includes(possibleUnit as (typeof PROPERTY_SIZE_UNITS)[number])) {
    return { size: parts[0], unit: possibleUnit };
  }
  return { size: parts[0] ?? "", unit: "Acre" };
};

const AgentFieldEntryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeDraft, saveFieldEntry } = useAgentCollection();
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAgentProfileLocal(user?.email);
  const profileAgentName = useMemo(
    () => profile.displayName || user?.name || "",
    [profile.displayName, user?.name]
  );
  const [propertyId, setPropertyId] = useState(
    activeDraft?.propertyId ?? createAgentPropertyId()
  );
  const [agentName, setAgentName] = useState(activeDraft?.agentName ?? profileAgentName);
  const [village, setVillage] = useState(activeDraft?.village ?? "");
  const [tehsil, setTehsil] = useState(activeDraft?.tehsil ?? "");
  const [district, setDistrict] = useState(activeDraft?.district ?? "");
  const [landType, setLandType] = useState(activeDraft?.landType ?? "");
  const parsedPropertySize = useMemo(
    () => parsePropertySize(activeDraft?.propertySize ?? ""),
    [activeDraft?.propertySize]
  );
  const [propertySizeValue, setPropertySizeValue] = useState(parsedPropertySize.size);
  const [propertySizeUnit, setPropertySizeUnit] = useState(parsedPropertySize.unit);
  const [roadAccess, setRoadAccess] = useState(activeDraft?.roadAccess ?? "");
  const [waterAvailability, setWaterAvailability] = useState(
    activeDraft?.waterAvailability ?? ""
  );
  const [ownerName, setOwnerName] = useState(activeDraft?.ownerName ?? "");
  const [ownerContact, setOwnerContact] = useState(activeDraft?.ownerContact ?? "");
  const images = activeDraft?.images ?? [];

  useEffect(() => {
    if (!activeDraft?.agentName && profileAgentName) {
      setAgentName(profileAgentName);
    }
  }, [activeDraft?.agentName, profileAgentName]);

  useEffect(() => {
    setPropertySizeValue(parsedPropertySize.size);
    setPropertySizeUnit(parsedPropertySize.unit);
  }, [parsedPropertySize.size, parsedPropertySize.unit]);

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          {t("agentPanel.fieldEntryPage.step1Title")}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("agentPanel.fieldEntryPage.step1Subtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await saveFieldEntry({
                propertyId,
                agentName,
                village,
                tehsil,
                district,
                landType,
                propertySize: `${propertySizeValue.trim()} ${propertySizeUnit}`.trim(),
                roadAccess,
                waterAvailability,
                ownerName: ownerName.trim() || undefined,
                ownerContact: ownerContact.trim() || undefined,
                images,
              });
              navigate("/agent/detailed-entry", { replace: false });
            } catch (error) {
              console.error("Unable to save agent step 1", error);
            }
          }}
        >
          <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2">
            <p className="text-xs font-semibold text-[var(--b1)]">
              {t("agentPanel.fieldEntry.propertyId")}
            </p>
            <p className="text-sm text-[var(--b1)]">{propertyId}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledInput
              label={t("agentPanel.form.agentName")}
              value={agentName}
              onChange={setAgentName}
              required
            />
            <LabeledInput
              label={t("agentPanel.form.village")}
              value={village}
              onChange={setVillage}
              required
            />
            <LabeledInput
              label={t("agentPanel.form.tehsil")}
              value={tehsil}
              onChange={setTehsil}
              required
            />
            <LabeledInput
              label={t("agentPanel.form.district")}
              value={district}
              onChange={setDistrict}
              required
            />
            <SelectInput
              label={t("agentPanel.form.soilType")}
              value={landType}
              onChange={setLandType}
              options={[...SOIL_TYPE_OPTIONS]}
              formatOption={translateSoilType}
              required
            />
            <div>
              <div className="mb-1 flex items-center justify-between text-sm font-medium">
                <label htmlFor="property-size-value">
                  {t("agentPanel.fieldEntryPage.totalLandArea")}
                </label>
                <span>{t("common.required")}</span>
              </div>
              <div className="grid grid-cols-[2fr_1fr] gap-2">
                <Input
                  id="property-size-value"
                  type="number"
                  min="0"
                  step="any"
                  value={propertySizeValue}
                  onChange={(e) => setPropertySizeValue(e.target.value)}
                  className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                  required
                />
                <select
                  value={propertySizeUnit}
                  onChange={(e) => setPropertySizeUnit(e.target.value)}
                  className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
                  required
                >
                  {PROPERTY_SIZE_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit === "Acre"
                        ? t("agentPanel.fieldEntryPage.acre")
                        : t("agentPanel.fieldEntryPage.hectare")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <SelectInput
              label={t("agentPanel.form.roadAccess")}
              value={roadAccess}
              onChange={setRoadAccess}
              options={["", "yes", "no"]}
              formatOption={(v) =>
                v === "yes" ? t("postProperty.common.yes") : v === "no" ? t("postProperty.common.no") : v
              }
              required
            />
            <SelectInput
              label={t("agentPanel.form.waterAvailability")}
              value={waterAvailability}
              onChange={setWaterAvailability}
              options={["", "yes", "no"]}
              formatOption={(v) =>
                v === "yes" ? t("postProperty.common.yes") : v === "no" ? t("postProperty.common.no") : v
              }
              required
            />
            <LabeledInput
              label={t("agentPanel.form.ownerName")}
              value={ownerName}
              onChange={setOwnerName}
              required
            />
            <LabeledInput
              label={t("agentPanel.form.ownerContact")}
              value={ownerContact}
              onChange={(value) => setOwnerContact(value.replace(/\D/g, "").slice(0, 10))}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
            >
              {t("agentPanel.fieldEntryPage.saveContinue")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

const LabeledInput = ({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium">{label}</label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
      required={required}
    />
  </div>
);

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  formatOption,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  formatOption?: (value: string) => string;
  required?: boolean;
}) => {
  const { t } = useTranslation();

  return (
  <div>
    <label className="mb-1 block text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
      required={required}
    >
      {options.map((option, index) => (
        <option key={`${label}-${option || "select"}`} value={option} disabled={required && index === 0}>
          {option ? (formatOption?.(option) ?? option) : t("agentPanel.fieldEntry.selectOption")}
        </option>
      ))}
    </select>
  </div>
  );
};

export default AgentFieldEntryPage;
