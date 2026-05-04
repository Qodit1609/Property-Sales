import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import Modal from "../../components/Modal/Modal";
import { Button, Input } from "@/components/common";
import CustomAlert from "@/components/common/CustomAlert";
import api from "@/lib/apiClient";
import {
  useAgentCollection,
  parseAgentStep2DocUrls,
  uploadAgentDocumentFiles,
  type AgentCollectedProperty,
  type AgentDetailedEntryData,
  type AgentFieldEntryData,
} from "./AgentCollectionContext";

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

const OWNERSHIP_TYPE_OPTIONS = [
  "",
  "Freehold",
  "Leasehold",
  "Power of Attorney",
  "Other",
] as const;

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--b1)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function flattenForCsv(value: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (value === null || value === undefined) {
    if (prefix) out[prefix] = "";
    return out;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") {
    out[prefix || "value"] = String(value);
    return out;
  }
  if (value instanceof Date) {
    out[prefix || "value"] = value.toISOString();
    return out;
  }
  if (Array.isArray(value)) {
    if (value.every((x) => x === null || ["string", "number", "boolean"].includes(typeof x))) {
      out[prefix || "items"] = JSON.stringify(value);
      return out;
    }
    value.forEach((item, i) => {
      Object.assign(out, flattenForCsv(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
    });
    return out;
  }
  if (t === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (!keys.length && prefix) {
      out[prefix] = "(no file data)";
      return out;
    }
    for (const k of keys) {
      const next = prefix ? `${prefix}.${k}` : k;
      Object.assign(out, flattenForCsv(obj[k], next));
    }
    return out;
  }
  out[prefix || "value"] = String(value);
  return out;
}

function escapeCsvCell(s: string): string {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function collectHttpUrls(val: unknown): string[] {
  const urls = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "string" && /^https?:\/\//i.test(v)) {
      urls.add(v);
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === "object") {
      Object.values(v as Record<string, unknown>).forEach(walk);
    }
  };
  walk(val);
  return [...urls];
}

function detailRows(p: AgentCollectedProperty): Record<string, string> {
  if (p.serverDoc && Object.keys(p.serverDoc).length > 0) {
    return flattenForCsv(p.serverDoc);
  }
  return {
    ...flattenForCsv({
      step1: p.step1,
      step2: p.step2 ?? {},
      status: p.status,
      propertyId: p.id,
      backendId: p.backendId ?? "",
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }),
  };
}

function exportAgentCsv(properties: AgentCollectedProperty[]) {
  const rows = properties.map((p) => {
    const flat = flattenForCsv(p.serverDoc ?? {});
    return {
      ...flat,
      entry_propertyId: p.id,
      entry_status: p.status,
      entry_createdAt: p.createdAt,
      entry_updatedAt: p.updatedAt,
      entry_backendId: p.backendId ?? "",
    };
  });
  const keySet = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
  const headers = [...keySet].sort((a, b) => a.localeCompare(b));
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers.map((h) =>
        escapeCsvCell(String((row as Record<string, string>)[h] ?? ""))
      ).join(",")
    ),
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `agent-properties-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function openExportPdf(properties: AgentCollectedProperty[]) {
  const w = window.open("", "_blank");
  if (!w) return;
  const style = `body{font-family:system-ui,sans-serif;padding:16px;color:#1b4332;}h1{font-size:18px;}h2{font-size:14px;margin-top:16px;}table{border-collapse:collapse;width:100%;font-size:11px;}td,th{border:1px solid #ccc;padding:6px;text-align:left;vertical-align:top;}img{max-width:180px;max-height:120px;object-fit:contain;}.meta{font-size:11px;color:#555;}`;
  let body = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Agent export</title><style>${style}</style></head><body><h1>Agent property export</h1><p class="meta">Generated ${escapeHtml(
    new Date().toLocaleString()
  )}</p>`;
  for (const p of properties) {
    body += `<h2>${escapeHtml(p.step1.village || "Untitled")} (${escapeHtml(p.id)})</h2>`;
    body += `<p class="meta">Status: ${escapeHtml(p.status)} · Updated: ${escapeHtml(
      p.updatedAt
    )}</p>`;
    body += `<table><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>`;
    const flat = detailRows(p);
    for (const [k, v] of Object.entries(flat).sort(([a], [b]) => a.localeCompare(b))) {
      body += `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`;
    }
    body += `</tbody></table>`;
    const urls = collectHttpUrls(p.serverDoc ?? p);
    const imgUrls = urls.filter((u) => /\.(png|jpe?g|gif|webp|bmp)(\?|$)/i.test(u));
    const pdfUrls = urls.filter((u) => /\.pdf(\?|$)/i.test(u));
    if (imgUrls.length) {
      body += `<p class="meta">Images</p><div style="display:flex;flex-wrap:wrap;gap:8px;">`;
      for (const u of imgUrls) {
        body += `<div><img src="${escapeHtml(u)}" alt="" /></div>`;
      }
      body += `</div>`;
    }
    if (pdfUrls.length) {
      body += `<p class="meta">Documents</p><ul>`;
      for (const u of pdfUrls) {
        body += `<li><a href="${escapeHtml(u)}">${escapeHtml(u)}</a></li>`;
      }
      body += `</ul>`;
    }
    body += `<hr />`;
  }
  body += `</body></html>`;
  w.document.open();
  w.document.write(body);
  w.document.close();
  w.onload = () => {
    w.focus();
    w.print();
  };
}

function EntryViewBody({ property }: { property: AgentCollectedProperty }) {
  const flat = detailRows(property);
  const urls = collectHttpUrls(property.serverDoc ?? property);
  const imgUrls = urls.filter((u) => /\.(png|jpe?g|gif|webp|bmp)(\?|$)/i.test(u));
  const docUrls = urls.filter((u) => /\.pdf(\?|$)/i.test(u));
  const otherUrls = urls.filter((u) => !imgUrls.includes(u) && !docUrls.includes(u));

  return (
    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
      <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          All fields
        </p>
        <dl className="grid gap-2 text-sm">
          {Object.entries(flat)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 border-b border-[var(--b2)]/50 pb-2 last:border-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
              >
                <dt className="break-all font-medium text-[var(--b1)]">{k}</dt>
                <dd className="break-all text-[var(--muted)]">{v || "—"}</dd>
              </div>
            ))}
        </dl>
      </div>

      {imgUrls.length > 0 ? (
        <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Images
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {imgUrls.map((u) => (
              <li key={u} className="overflow-hidden rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30">
                <img src={u} alt="" className="max-h-48 w-full object-contain" loading="lazy" />
                <p className="break-all p-2 text-[11px] text-[var(--muted)]">{u}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {docUrls.length > 0 ? (
        <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            PDFs / documents
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {docUrls.map((u) => (
              <li key={u}>
                <a
                  href={u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[var(--b1-mid)] underline"
                >
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {otherUrls.length > 0 ? (
        <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Other links
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {otherUrls.map((u) => (
              <li key={u}>
                <a
                  href={u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[var(--b1-mid)] underline"
                >
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function EntryEditForm({
  property,
  onCancel,
  onSaved,
}: {
  property: AgentCollectedProperty;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const s1 = property.step1;
  const parsed = useMemo(() => parsePropertySize(s1.propertySize ?? ""), [s1.propertySize]);
  const [agentName, setAgentName] = useState(s1.agentName);
  const [village, setVillage] = useState(s1.village);
  const [tehsil, setTehsil] = useState(s1.tehsil);
  const [district, setDistrict] = useState(s1.district);
  const [landType, setLandType] = useState(s1.landType);
  const [propertySizeValue, setPropertySizeValue] = useState(parsed.size);
  const [propertySizeUnit, setPropertySizeUnit] = useState(parsed.unit);
  const [roadAccess, setRoadAccess] = useState(s1.roadAccess);
  const [waterAvailability, setWaterAvailability] = useState(s1.waterAvailability);
  const [ownerName, setOwnerName] = useState(s1.ownerName ?? "");
  const [ownerContact, setOwnerContact] = useState(s1.ownerContact ?? "");

  const s2 = property.step2;
  const [expectedPrice, setExpectedPrice] = useState(s2?.expectedPrice ?? "");
  const [negotiable, setNegotiable] = useState(s2?.negotiable ?? "yes");
  const [ownershipType, setOwnershipType] = useState(s2?.ownershipType ?? "");
  const [registryAvailable, setRegistryAvailable] = useState(s2?.registryAvailable ?? "yes");
  const [khasraAvailable, setKhasraAvailable] = useState(s2?.khasraAvailable ?? "yes");
  const [landDispute, setLandDispute] = useState(s2?.landDispute ?? "no");
  const [electricity, setElectricity] = useState(s2?.electricity ?? "yes");
  const [cropHistory, setCropHistory] = useState(s2?.cropHistory ?? "");
  const [ownerContact2, setOwnerContact2] = useState(s2?.ownerContact ?? "");
  const [exactLocation, setExactLocation] = useState(s2?.exactLocation ?? "");
  const [nearbyLandmarks, setNearbyLandmarks] = useState(s2?.nearbyLandmarks ?? "");
  const [roadType, setRoadType] = useState(s2?.roadType ?? "");
  const [waterSourceDetails, setWaterSourceDetails] = useState(s2?.waterSourceDetails ?? "");
  const [connectivityInfo, setConnectivityInfo] = useState(s2?.connectivityInfo ?? "");
  const [propertyHighlights, setPropertyHighlights] = useState(s2?.propertyHighlights ?? "");
  const [issuesDrawbacks, setIssuesDrawbacks] = useState(s2?.issuesDrawbacks ?? "");
  const [notes, setNotes] = useState(s2?.notes ?? "");

  const step2FromServer = property.serverDoc?.step2 as Record<string, unknown> | undefined;
  const [khasraKeptUrls, setKhasraKeptUrls] = useState<string[]>(() =>
    parseAgentStep2DocUrls(step2FromServer?.khasraFiles).filter(
      (x): x is string => typeof x === "string"
    )
  );
  const [newKhasraFiles, setNewKhasraFiles] = useState<File[]>([]);
  const [khatauniKeptUrls, setKhatauniKeptUrls] = useState<string[]>(() =>
    parseAgentStep2DocUrls(step2FromServer?.khatauniFiles).filter(
      (x): x is string => typeof x === "string"
    )
  );
  const [newKhatauniFiles, setNewKhatauniFiles] = useState<File[]>([]);
  const [nakshaKeptUrls, setNakshaKeptUrls] = useState<string[]>(() =>
    parseAgentStep2DocUrls(step2FromServer?.nakshaFiles).filter(
      (x): x is string => typeof x === "string"
    )
  );
  const [newNakshaFiles, setNewNakshaFiles] = useState<File[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property.backendId) {
      setError("Missing server reference for this entry.");
      return;
    }
    setSaving(true);
    setError(null);

    let khasraUrls: string[] = [];
    let khatauniUrls: string[] = [];
    let nakshaUrls: string[] = [];
    try {
      khasraUrls = [
        ...khasraKeptUrls,
        ...(await uploadAgentDocumentFiles(newKhasraFiles, "agent-khasra")),
      ];
      khatauniUrls = [
        ...khatauniKeptUrls,
        ...(await uploadAgentDocumentFiles(newKhatauniFiles, "agent-khatauni")),
      ];
      nakshaUrls = [
        ...nakshaKeptUrls,
        ...(await uploadAgentDocumentFiles(newNakshaFiles, "agent-naksha")),
      ];
    } catch (uploadErr) {
      console.error(uploadErr);
      setError(uploadErr instanceof Error ? uploadErr.message : "Document upload failed");
      setSaving(false);
      return;
    }

    const step1Payload: AgentFieldEntryData = {
      propertyId: property.id,
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
      images: [],
    };
    const step2Payload: AgentDetailedEntryData = {
      propertyId: property.id,
      expectedPrice,
      negotiable,
      ownershipType,
      registryAvailable,
      khasraAvailable,
      landDispute,
      electricity,
      cropHistory,
      ownerContact: ownerContact2,
      exactLocation,
      nearbyLandmarks,
      roadType,
      waterSourceDetails,
      connectivityInfo,
      propertyHighlights,
      issuesDrawbacks,
      attachments: [],
      khasraFiles: khasraUrls,
      khatauniFiles: khatauniUrls,
      nakshaFiles: nakshaUrls,
      notes,
    };
    const hadStep2 = Boolean(property.step2 && Object.keys(property.step2).length > 0);
    const step2Touched =
      expectedPrice.trim() ||
      ownershipType.trim() ||
      ownerContact2.trim() ||
      negotiable !== "yes" ||
      registryAvailable !== "yes" ||
      khasraAvailable !== "yes" ||
      landDispute !== "no" ||
      electricity !== "yes" ||
      cropHistory.trim() ||
      exactLocation.trim() ||
      nearbyLandmarks.trim() ||
      roadType.trim() ||
      waterSourceDetails.trim() ||
      connectivityInfo.trim() ||
      propertyHighlights.trim() ||
      issuesDrawbacks.trim() ||
      notes.trim() ||
      newKhasraFiles.length > 0 ||
      newKhatauniFiles.length > 0 ||
      newNakshaFiles.length > 0 ||
      khasraKeptUrls.length > 0 ||
      khatauniKeptUrls.length > 0 ||
      nakshaKeptUrls.length > 0;
    const shouldSyncStep2 = hadStep2 || Boolean(step2Touched);

    try {
      await api.put(`/agent/property/${property.backendId}/step1`, step1Payload);
      if (shouldSyncStep2) {
        if (!expectedPrice.trim() || !ownershipType.trim() || !ownerContact2.trim()) {
          setError("Complete Expected Price, Ownership Type, and Owner Contact (step 2), or clear step 2 fields.");
          return;
        }
        await api.put(`/agent/property/${property.backendId}/step2`, step2Payload);
      }
      await onSaved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}

      <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Step 1
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldLabel label="Agent Name" required>
            <Input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
          <FieldLabel label="Village" required>
            <Input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
          <FieldLabel label="Tehsil" required>
            <Input
              value={tehsil}
              onChange={(e) => setTehsil(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
          <FieldLabel label="District" required>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
          <FieldLabel label="Soil Type" required>
            <select
              value={landType}
              onChange={(e) => setLandType(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            >
              {SOIL_TYPE_OPTIONS.map((option, index) => (
                <option key={`soil-${option || "x"}`} value={option} disabled={index === 0}>
                  {option ? option : "Select option"}
                </option>
              ))}
            </select>
          </FieldLabel>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-medium">
              <span>Total land area</span>
              <span>Required</span>
            </div>
            <div className="grid grid-cols-[2fr_1fr] gap-2">
              <Input
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
          <FieldLabel label="Road Access" required>
            <select
              value={roadAccess}
              onChange={(e) => setRoadAccess(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            >
              <option value="">Select option</option>
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Water Availability" required>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            >
              <option value="">Select option</option>
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Owner Name" required>
            <Input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
          <FieldLabel label="Owner Contact" required>
            <Input
              value={ownerContact}
              onChange={(e) => setOwnerContact(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              required
            />
          </FieldLabel>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Step 2
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldLabel label="Expected Price">
            <Input
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Ownership Type">
            <select
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              {OWNERSHIP_TYPE_OPTIONS.map((option, index) => (
                <option key={`own-${option || "x"}`} value={option} disabled={index === 0}>
                  {option ? option : "Select"}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label="Negotiable">
            <select
              value={negotiable}
              onChange={(e) => setNegotiable(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Registry Available">
            <select
              value={registryAvailable}
              onChange={(e) => setRegistryAvailable(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Khasra Available">
            <select
              value={khasraAvailable}
              onChange={(e) => setKhasraAvailable(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Land Dispute">
            <select
              value={landDispute}
              onChange={(e) => setLandDispute(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Electricity">
            <select
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            >
              <option value="yes">YES</option>
              <option value="no">NO</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Crop History">
            <Input
              value={cropHistory}
              onChange={(e) => setCropHistory(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Owner Contact (step 2)">
            <Input
              value={ownerContact2}
              onChange={(e) => setOwnerContact2(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Exact Location">
            <Input
              value={exactLocation}
              onChange={(e) => setExactLocation(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Nearby Landmarks">
            <Input
              value={nearbyLandmarks}
              onChange={(e) => setNearbyLandmarks(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Road Type">
            <Input
              value={roadType}
              onChange={(e) => setRoadType(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Water Source Details">
            <Input
              value={waterSourceDetails}
              onChange={(e) => setWaterSourceDetails(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Connectivity Info">
            <Input
              value={connectivityInfo}
              onChange={(e) => setConnectivityInfo(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Property Highlights">
            <Input
              value={propertyHighlights}
              onChange={(e) => setPropertyHighlights(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
          <FieldLabel label="Issues / Drawbacks">
            <Input
              value={issuesDrawbacks}
              onChange={(e) => setIssuesDrawbacks(e.target.value)}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </FieldLabel>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] p-3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
            Upload khasra khatauni naksha
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="dash-khasra-files">
              Upload khasra
            </label>
            <input
              id="dash-khasra-files"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) {
                  setNewKhasraFiles((prev) => [...prev, ...files]);
                }
                e.currentTarget.value = "";
              }}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
          {khasraKeptUrls.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {khasraKeptUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate text-sm text-[var(--b1-mid)] underline"
                  >
                    {url}
                  </a>
                  <button
                    type="button"
                    aria-label="Remove document"
                    onClick={() => setKhasraKeptUrls((prev) => prev.filter((u) => u !== url))}
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {newKhasraFiles.length > 0 ? (
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {newKhasraFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <span className="truncate text-sm text-[var(--b1)]">{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setNewKhasraFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
                    }
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="dash-khatauni-files">
              Upload khatauni
            </label>
            <input
              id="dash-khatauni-files"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) {
                  setNewKhatauniFiles((prev) => [...prev, ...files]);
                }
                e.currentTarget.value = "";
              }}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
          {khatauniKeptUrls.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {khatauniKeptUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate text-sm text-[var(--b1-mid)] underline"
                  >
                    {url}
                  </a>
                  <button
                    type="button"
                    aria-label="Remove document"
                    onClick={() => setKhatauniKeptUrls((prev) => prev.filter((u) => u !== url))}
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {newKhatauniFiles.length > 0 ? (
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {newKhatauniFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <span className="truncate text-sm text-[var(--b1)]">{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setNewKhatauniFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
                    }
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="dash-naksha-files">
              Upload naksha
            </label>
            <input
              id="dash-naksha-files"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) {
                  setNewNakshaFiles((prev) => [...prev, ...files]);
                }
                e.currentTarget.value = "";
              }}
              className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
          {nakshaKeptUrls.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {nakshaKeptUrls.map((url) => (
                <li
                  key={url}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate text-sm text-[var(--b1-mid)] underline"
                  >
                    {url}
                  </a>
                  <button
                    type="button"
                    aria-label="Remove document"
                    onClick={() => setNakshaKeptUrls((prev) => prev.filter((u) => u !== url))}
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {newNakshaFiles.length > 0 ? (
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {newNakshaFiles.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-2"
                >
                  <span className="truncate text-sm text-[var(--b1)]">{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setNewNakshaFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
                    }
                    className="shrink-0 rounded-md p-1 text-[var(--muted)] transition hover:bg-[var(--white)] hover:text-[var(--error)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium" htmlFor="dash-notes">
            Notes
          </label>
          <textarea
            id="dash-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-md border border-[var(--b2)] px-4 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function FieldLabel({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
        {required ? <span className="text-[var(--error)]"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

const AgentDashboardPage: React.FC = () => {
  const { properties, refreshProperties } = useAgentCollection();
  const [viewing, setViewing] = useState<AgentCollectedProperty | null>(null);
  const [editing, setEditing] = useState<AgentCollectedProperty | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AgentCollectedProperty | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const recentActivity = useMemo(() => {
    return [...properties]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [properties]);

  const statusTotals = useMemo(() => {
    return properties.reduce(
      (acc, property) => {
        if (
          property.status === "draft" ||
          property.status === "incomplete" ||
          property.status === "ready"
        ) {
          acc[property.status] += 1;
        }
        return acc;
      },
      { draft: 0, incomplete: 0, ready: 0 }
    );
  }, [properties]);

  const handleAfterSave = async () => {
    await refreshProperties();
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    const target = pendingDelete;
    if (!target || deleteInProgress) return;
    if (!target.backendId) {
      setPendingDelete(null);
      setDeleteError(
        "This entry cannot be deleted because it is not saved on the server yet."
      );
      return;
    }
    setDeleteInProgress(true);
    setDeleteError(null);
    try {
      await api.delete(`/agent/property/${target.backendId}`);
      const removedId = target.id;
      setPendingDelete(null);
      setViewing((v) => (v?.id === removedId ? null : v));
      setEditing((e) => (e?.id === removedId ? null : e));
      await refreshProperties();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete property.";
      setDeleteError(message);
      setPendingDelete(null);
    } finally {
      setDeleteInProgress(false);
    }
  };

  return (
    <section className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--b1)]">
            Agent Dashboard
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Track listings, leads and visits at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end shrink-0">
          <Button
            type="button"
            onClick={() => exportAgentCsv(properties)}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
          >
            Export CSV
          </Button>
          <Button
            type="button"
            onClick={() => openExportPdf(properties)}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected Properties"
          value={String(properties.length)}
          hint="Agent property collection entries."
        />
        <StatCard
          label="Draft"
          value={String(statusTotals.draft)}
          hint="Step 1 saved and editable."
        />
        <StatCard
          label="Incomplete"
          value={String(statusTotals.incomplete)}
          hint="Step 2 pending final details."
        />
        <StatCard
          label="Ready"
          value={String(statusTotals.ready)}
          hint="Ready for admin approval flow."
        />
      </div>

      <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
        <div className="border-b border-[var(--b2)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            Recent Activity
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            Latest property status snapshots.
          </p>
        </div>
        <div className="p-4">
          {deleteError ? (
            <p className="mb-3 text-sm text-[var(--error)]" role="alert">
              {deleteError}
            </p>
          ) : null}
          {recentActivity.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No recent activity found.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-2 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--b1)]">
                      {a.step1.village || "Untitled"}
                    </p>
                    <p className="text-[11px] text-[var(--muted)]">
                      ID: {a.id}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <span className="shrink-0 rounded-full bg-[var(--b2-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--b1)] ring-1 ring-[var(--b2)]">
                      {String(a.status).toUpperCase()}
                    </span>
                    <Button
                      type="button"
                      onClick={() => setViewing(a)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditing(a)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setPendingDelete(a);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--b2)] bg-[var(--white)] px-3 py-1 text-xs font-medium text-[var(--b1)] hover:bg-[var(--b2-soft)] transition"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing ? `Entry · ${viewing.step1.village || viewing.id}` : "Entry"}
      >
        {viewing ? <EntryViewBody property={viewing} /> : null}
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Edit · ${editing.step1.village || editing.id}` : "Edit"}
      >
        {editing ? (
          <EntryEditForm
            key={editing.id}
            property={editing}
            onCancel={() => setEditing(null)}
            onSaved={handleAfterSave}
          />
        ) : null}
      </Modal>

      <CustomAlert
        open={Boolean(pendingDelete)}
        title="Delete property?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.step1.village || pendingDelete.id}"? This cannot be undone.`
            : ""
        }
        confirmLabel={deleteInProgress ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        showCancel
        onCancel={() => {
          if (deleteInProgress) return;
          setPendingDelete(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </section>
  );
};

export default AgentDashboardPage;
