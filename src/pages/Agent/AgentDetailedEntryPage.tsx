import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Input } from "@/components/common";
import { X } from "lucide-react";
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
  const navigate = useNavigate();
  const { activeDraft, saveFieldEntry, saveDetailedEntry, setPropertyStatus } = useAgentCollection();

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
          Property Collection - Step 2
        </h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Complete detailed property information for review readiness.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveFieldEntry({
              ...activeDraft,
              landType,
              propertySize: `${propertySizeValue.trim()} ${propertySizeUnit}`.trim(),
              roadAccess,
              waterAvailability,
            });
            saveDetailedEntry({
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
          }}
        >
          <div className="rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2">
            <p className="text-xs font-semibold text-[var(--b1)]">
              Linked Property ID
            </p>
            <p className="text-sm text-[var(--b1)]">{propertyId}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">
              Current status preview: {statusPreview}
            </p>
          </div>

          <SectionBlock title="Basic Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="Expected Price"
                value={expectedPrice}
                onChange={setExpectedPrice}
                required
              />
              <SelectInput
                label="Ownership Type"
                value={ownershipType}
                onChange={setOwnershipType}
                options={[...OWNERSHIP_TYPE_OPTIONS]}
                placeholderText="Select"
                uppercaseOptions={false}
                required
              />
              <SelectInput
                label="Negotiable"
                value={negotiable}
                onChange={setNegotiable}
                options={["yes", "no"]}
              />
              <SelectInput
                label="Registry Available"
                value={registryAvailable}
                onChange={setRegistryAvailable}
                options={["yes", "no"]}
              />
              <SelectInput
                label="Khasra Available"
                value={khasraAvailable}
                onChange={setKhasraAvailable}
                options={["yes", "no"]}
              />
              <LabeledInput
                label="Owner Contact"
                value={ownerContact}
                onChange={(value) => setOwnerContact(value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
          </SectionBlock>

          <SectionBlock title="Field Entry Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectInput
                label="Soil Type"
                value={landType}
                onChange={setLandType}
                options={[...SOIL_TYPE_OPTIONS]}
                required
              />
              <div>
                <div className="mb-1 flex items-center justify-between text-sm font-medium">
                  <label htmlFor="property-size-value">Total land area</label>
                  <span>Required</span>
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
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <SelectInput
                label="Road Access"
                value={roadAccess}
                onChange={setRoadAccess}
                options={["", "yes", "no"]}
                required
              />
              <SelectInput
                label="Water Availability"
                value={waterAvailability}
                onChange={setWaterAvailability}
                options={["", "yes", "no"]}
                required
              />
            </div>
          </SectionBlock>

          <SectionBlock title="Location Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="Exact Location Description"
                value={exactLocation}
                onChange={setExactLocation}
              />
              <LabeledInput
                label="Nearby Landmarks"
                value={nearbyLandmarks}
                onChange={setNearbyLandmarks}
              />
              <LabeledInput
                label="Road Type"
                value={roadType}
                onChange={setRoadType}
              />
              <LabeledInput
                label="Connectivity Info"
                value={connectivityInfo}
                onChange={setConnectivityInfo}
              />
            </div>
          </SectionBlock>

          <SectionBlock title="Property Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="Water Source Details"
                value={waterSourceDetails}
                onChange={setWaterSourceDetails}
              />
              <SelectInput
                label="Any Land Dispute"
                value={landDispute}
                onChange={setLandDispute}
                options={["yes", "no"]}
              />
              <SelectInput
                label="Electricity"
                value={electricity}
                onChange={setElectricity}
                options={["yes", "no"]}
              />
              <LabeledInput
                label="Crop History"
                value={cropHistory}
                onChange={setCropHistory}
                required
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <TextAreaInput
                id="propertyHighlights"
                label="Property Highlights"
                value={propertyHighlights}
                onChange={setPropertyHighlights}
                placeholder="Key strengths and unique points..."
              />
              <TextAreaInput
                id="issuesDrawbacks"
                label="Issues / Drawbacks"
                value={issuesDrawbacks}
                onChange={setIssuesDrawbacks}
                placeholder="Any known issues or limitations..."
              />
            </div>
          </SectionBlock>

          <SectionBlock title="Media & Documents">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="attachments">
                Upload Files (images, videos, documents, audio)
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

          <SectionBlock title="Upload khasra khatauni naksha">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="khasra-files">
                Upload khasra
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
                Upload khatauni
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
                Upload naksha
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
              label="Notes"
              value={notes}
              onChange={setNotes}
              placeholder="Additional notes..."
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
              Back to Step 1
            </Button>
            <Button
              type="button"
              onClick={() => setPropertyStatus(propertyId, "incomplete")}
              className="w-full sm:w-auto rounded-md border border-[var(--b2)] bg-[var(--b2-soft)] px-4 py-2 text-sm font-semibold text-[var(--b1)]"
            >
              Save as Incomplete
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
            >
              Mark Ready
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
  required,
  placeholderText,
  uppercaseOptions = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholderText?: string;
  uppercaseOptions?: boolean;
}) => (
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
          {option ? (uppercaseOptions ? option.toUpperCase() : option) : placeholderText ?? "Select option"}
        </option>
      ))}
    </select>
  </div>
);

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
                aria-label={`Remove ${item.file.name}`}
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
