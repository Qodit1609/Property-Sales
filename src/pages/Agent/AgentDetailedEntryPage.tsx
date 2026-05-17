import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/common";
import { X } from "lucide-react";
import { translateOwnershipType, translateSoilType, translateStatus } from "@/lib/i18nHelpers";
import { useAgentCollection } from "./AgentCollectionContext";

const PROPERTY_SIZE_UNITS = ["Acre", "Hectare"] as const;
const OWNERSHIP_TYPE_OPTIONS = [
  "",
  "Freehold",
  "Leasehold",
  "Power of Attorney",
  "Other",
] as const;
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

const AgentDetailedEntryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeDraft, saveFieldEntry, saveDetailedEntry, setPropertyStatus } = useAgentCollection();

  const formatYesNo = (value: string) =>
    value === "yes" ? t("postProperty.common.yes") : value === "no" ? t("postProperty.common.no") : value;

  const statusLabel = (status: string) => {
    const key = `agentPanel.dashboard.stats.${status}` as const;
    return t(key, { defaultValue: translateStatus(status) });
  };

  const [expectedPrice, setExpectedPrice] = useState("");
  const [negotiable, setNegotiable] = useState("yes");
  const [ownershipType, setOwnershipType] = useState("");
  const [registryAvailable, setRegistryAvailable] = useState("yes");
  const [khasraAvailable, setKhasraAvailable] = useState("yes");
  const [landDispute, setLandDispute] = useState("no");
  const [electricity, setElectricity] = useState("yes");
  const [cropHistory, setCropHistory] = useState("");
  const [ownerContact, setOwnerContact] = useState(activeDraft?.ownerContact ?? "");
  const [exactLocation, setExactLocation] = useState("");
  const [nearbyLandmarks, setNearbyLandmarks] = useState("");
  const [roadType, setRoadType] = useState("");
  const [waterSourceDetails, setWaterSourceDetails] = useState("");
  const [connectivityInfo, setConnectivityInfo] = useState("");
  const [propertyHighlights, setPropertyHighlights] = useState("");
  const [issuesDrawbacks, setIssuesDrawbacks] = useState("");
  const [attachments, setAttachments] = useState<File[]>(activeDraft?.images ?? []);
  const [khasraFiles, setKhasraFiles] = useState<File[]>([]);
  const [khatauniFiles, setKhatauniFiles] = useState<File[]>([]);
  const [nakshaFiles, setNakshaFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [landType, setLandType] = useState(activeDraft?.landType ?? "");
  const parsedPropertySize = useMemo(
    () => parsePropertySize(activeDraft?.propertySize ?? ""),
    [activeDraft?.propertySize]
  );
  const [propertySizeValue, setPropertySizeValue] = useState(parsedPropertySize.size);
  const [propertySizeUnit, setPropertySizeUnit] = useState(parsedPropertySize.unit);
  const [roadAccess, setRoadAccess] = useState(activeDraft?.roadAccess ?? "");
  const [waterAvailability, setWaterAvailability] = useState(activeDraft?.waterAvailability ?? "");

  const propertyId = activeDraft?.propertyId ?? "";

  const statusPreview = useMemo(() => {
    if (!activeDraft) return "incomplete";
    if (!expectedPrice.trim() || !ownershipType.trim()) return "incomplete";
    return "ready";
  }, [activeDraft, expectedPrice, ownershipType]);

  if (!activeDraft) {
    return <Navigate to="/agent/field-entry" replace />;
  }

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
          {t("agentPanel.fieldEntryPage.step2Title")}
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {t("agentPanel.fieldEntryPage.step2Subtitle")}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await saveFieldEntry({
                ...activeDraft,
                landType,
                propertySize: `${propertySizeValue.trim()} ${propertySizeUnit}`.trim(),
                roadAccess,
                waterAvailability,
              });
              await saveDetailedEntry({
                propertyId,
                expectedPrice,
                negotiable,
                ownershipType,
                registryAvailable,
                khasraAvailable,
                landDispute,
                electricity,
                cropHistory,
                ownerContact,
                exactLocation,
                nearbyLandmarks,
                roadType,
                waterSourceDetails,
                connectivityInfo,
                propertyHighlights,
                issuesDrawbacks,
                attachments,
                khasraFiles,
                khatauniFiles,
                nakshaFiles,
                notes,
              });
              navigate("/agent/dashboard", { replace: true });
            } catch (error) {
              console.error("Unable to save agent step 2", error);
            }
          }}
        >
          <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2">
            <p className="text-xs font-semibold text-[var(--b1)]">
              {t("agentPanel.fieldEntryPage.linkedPropertyId")}
            </p>
            <p className="text-sm text-[var(--b1)]">{propertyId}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">
              {t("agentPanel.fieldEntryPage.statusPreview", {
                status: statusLabel(statusPreview),
              })}
            </p>
          </div>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.basicInfo")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label={t("agentPanel.form.expectedPrice")}
                value={expectedPrice}
                onChange={setExpectedPrice}
                required
              />
              <SelectInput
                label={t("agentPanel.form.ownershipType")}
                value={ownershipType}
                onChange={setOwnershipType}
                options={[...OWNERSHIP_TYPE_OPTIONS]}
                placeholderText={t("agentPanel.form.select")}
                formatOption={translateOwnershipType}
                uppercaseOptions={false}
                required
              />
              <SelectInput
                label={t("agentPanel.form.negotiable")}
                value={negotiable}
                onChange={setNegotiable}
                options={["yes", "no"]}
                formatOption={formatYesNo}
              />
              <SelectInput
                label={t("agentPanel.form.registryAvailable")}
                value={registryAvailable}
                onChange={setRegistryAvailable}
                options={["yes", "no"]}
                formatOption={formatYesNo}
              />
              <SelectInput
                label={t("agentPanel.form.khasraAvailable")}
                value={khasraAvailable}
                onChange={setKhasraAvailable}
                options={["yes", "no"]}
                formatOption={formatYesNo}
              />
              <LabeledInput
                label={t("agentPanel.form.ownerContact")}
                value={ownerContact}
                onChange={(value) => setOwnerContact(value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </SectionBlock>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.fieldEntryDetails")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                formatOption={formatYesNo}
                required
              />
              <SelectInput
                label={t("agentPanel.form.waterAvailability")}
                value={waterAvailability}
                onChange={setWaterAvailability}
                options={["", "yes", "no"]}
                formatOption={formatYesNo}
                required
              />
            </div>
          </SectionBlock>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.locationDetails")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label={t("agentPanel.fieldEntryPage.exactLocationDescription")}
                value={exactLocation}
                onChange={setExactLocation}
              />
              <LabeledInput
                label={t("agentPanel.form.nearbyLandmarks")}
                value={nearbyLandmarks}
                onChange={setNearbyLandmarks}
              />
              <LabeledInput
                label={t("agentPanel.form.roadType")}
                value={roadType}
                onChange={setRoadType}
              />
              <LabeledInput
                label={t("agentPanel.form.connectivityInfo")}
                value={connectivityInfo}
                onChange={setConnectivityInfo}
              />
            </div>
          </SectionBlock>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.propertyDetails")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label={t("agentPanel.form.waterSourceDetails")}
                value={waterSourceDetails}
                onChange={setWaterSourceDetails}
              />
              <SelectInput
                label={t("agentPanel.fieldEntryPage.anyLandDispute")}
                value={landDispute}
                onChange={setLandDispute}
                options={["yes", "no"]}
                formatOption={formatYesNo}
              />
              <SelectInput
                label={t("agentPanel.form.electricity")}
                value={electricity}
                onChange={setElectricity}
                options={["yes", "no"]}
                formatOption={formatYesNo}
              />
              <LabeledInput
                label={t("agentPanel.form.cropHistory")}
                value={cropHistory}
                onChange={setCropHistory}
                required
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <TextAreaInput
                id="propertyHighlights"
                label={t("agentPanel.form.propertyHighlights")}
                value={propertyHighlights}
                onChange={setPropertyHighlights}
                placeholder={t("agentPanel.fieldEntryPage.highlightsPlaceholder")}
              />
              <TextAreaInput
                id="issuesDrawbacks"
                label={t("agentPanel.form.issuesDrawbacks")}
                value={issuesDrawbacks}
                onChange={setIssuesDrawbacks}
                placeholder={t("agentPanel.fieldEntryPage.issuesPlaceholder")}
              />
            </div>
          </SectionBlock>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.mediaDocuments")}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="attachments">
                {t("agentPanel.fieldEntryPage.uploadFiles")}
              </label>
              <input
                id="attachments"
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) {
                    setAttachments((prev) => [...prev, ...files]);
                  }
                  e.currentTarget.value = "";
                }}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <PreviewList
              files={attachments}
              onRemove={(index) =>
                setAttachments((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
              }
            />
          </SectionBlock>

          <SectionBlock title={t("agentPanel.fieldEntryPage.sections.uploadDocs")}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="khasra-files">
                {t("agentPanel.fieldEntryPage.uploadKhasra")}
              </label>
              <input
                id="khasra-files"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) {
                    setKhasraFiles((prev) => [...prev, ...files]);
                  }
                  e.currentTarget.value = "";
                }}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <PreviewList
              files={khasraFiles}
              onRemove={(index) =>
                setKhasraFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
              }
            />

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium" htmlFor="khatauni-files">
                {t("agentPanel.fieldEntryPage.uploadKhatauni")}
              </label>
              <input
                id="khatauni-files"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) {
                    setKhatauniFiles((prev) => [...prev, ...files]);
                  }
                  e.currentTarget.value = "";
                }}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <PreviewList
              files={khatauniFiles}
              onRemove={(index) =>
                setKhatauniFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
              }
            />

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium" htmlFor="naksha-files">
                {t("agentPanel.fieldEntryPage.uploadNaksha")}
              </label>
              <input
                id="naksha-files"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) {
                    setNakshaFiles((prev) => [...prev, ...files]);
                  }
                  e.currentTarget.value = "";
                }}
                className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <PreviewList
              files={nakshaFiles}
              onRemove={(index) =>
                setNakshaFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
              }
            />
          </SectionBlock>

          <div>
            <TextAreaInput
              id="notes"
              label={t("agentPanel.fieldEntryPage.notes")}
              value={notes}
              onChange={setNotes}
              placeholder={t("agentPanel.fieldEntryPage.notesPlaceholder")}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                setPropertyStatus(propertyId, "draft");
                navigate("/agent/field-entry");
              }}
              className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm"
            >
              {t("agentPanel.fieldEntryPage.backToStep1")}
            </Button>
            <Button
              type="button"
              onClick={() => setPropertyStatus(propertyId, "incomplete")}
              className="w-full sm:w-auto rounded-md border border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-2 text-sm font-semibold text-[var(--b1)]"
            >
              {t("agentPanel.fieldEntryPage.saveIncomplete")}
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
            >
              {t("agentPanel.fieldEntryPage.markReady")}
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

const SectionBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
      {title}
    </p>
    {children}
  </div>
);

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  formatOption,
  required,
  placeholderText,
  uppercaseOptions = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  formatOption?: (value: string) => string;
  required?: boolean;
  placeholderText?: string;
  uppercaseOptions?: boolean;
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
        {options.map((option, index) => {
          const display = option
            ? formatOption?.(option) ?? (uppercaseOptions ? option.toUpperCase() : option)
            : placeholderText ?? t("agentPanel.fieldEntry.selectOption");
          return (
            <option
              key={`${label}-${option || "select"}`}
              value={option}
              disabled={required && index === 0}
            >
              {display}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const TextAreaInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium" htmlFor={id}>
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
      placeholder={placeholder}
    />
  </div>
);

const PreviewList = ({
  files,
  onRemove,
}: {
  files: File[];
  onRemove: (index: number) => void;
}) => {
  const { t } = useTranslation();
  const previewItems = useMemo(
    () =>
      files.map((file, index) => {
        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        return {
          key: `${file.name}-${file.size}-${index}`,
          file,
          previewUrl: isImage || isPdf ? URL.createObjectURL(file) : null,
          isImage,
          isPdf,
        };
      }),
    [files]
  );

  useEffect(
    () => () => {
      previewItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    },
    [previewItems]
  );

  if (!files.length) return null;

  return (
    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {previewItems.map((item, index) => {
        return (
          <li key={item.key} className="rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2">
            {(item.isImage || item.isPdf) && item.previewUrl ? (
              <div className="mb-2 overflow-hidden rounded-md border border-[var(--b2)] bg-[var(--white)]">
                {item.isImage ? (
                  <img src={item.previewUrl} alt={item.file.name} className="h-40 w-full object-cover" />
                ) : (
                  <iframe
                    src={item.previewUrl}
                    title={item.file.name}
                    className="h-40 w-full"
                    loading="lazy"
                  />
                )}
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-[var(--b1)]">{item.file.name}</span>
              <button
                type="button"
                aria-label={t("agentPanel.fieldEntryPage.removeFile", { name: item.file.name })}
                onClick={() => onRemove(index)}
                className="rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default AgentDetailedEntryPage;
