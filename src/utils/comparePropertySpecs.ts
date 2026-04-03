import type { Property } from "../features/properties/propertyType";

const IGNORED_KEYS = new Set([
  "_id",
  "__v",
  "images",
  "videos",
  "createdAt",
  "updatedAt",
  "postedAt",
]);

function shouldIgnorePath(path: string): boolean {
  const head = path.split(".")[0];
  return IGNORED_KEYS.has(head);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Date);
}

/**
 * Flattens a property into dot-path keys for dynamic comparison.
 * Only includes leaf values; objects are recursed, arrays and primitives are leaves.
 */
export function flattenPropertySpecs(property: Property): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  const walk = (node: unknown, prefix: string) => {
    if (node === undefined) return;
    if (node === null) {
      if (prefix) out[prefix] = null;
      return;
    }

    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
      if (prefix && !shouldIgnorePath(prefix)) out[prefix] = node;
      return;
    }

    if (node instanceof Date) {
      if (prefix && !shouldIgnorePath(prefix)) out[prefix] = node.toISOString();
      return;
    }

    if (Array.isArray(node)) {
      if (prefix && !shouldIgnorePath(prefix)) out[prefix] = node;
      return;
    }

    if (!isPlainObject(node)) {
      if (prefix && !shouldIgnorePath(prefix)) out[prefix] = node;
      return;
    }

    const keys = Object.keys(node);
    if (keys.length === 0) {
      return;
    }

    for (const k of keys) {
      if (IGNORED_KEYS.has(k)) continue;
      /** Title is shown in each column header. */
      if (!prefix && k === "title") continue;
      const next = prefix ? `${prefix}.${k}` : k;
      if (shouldIgnorePath(next)) continue;
      walk(node[k], next);
    }
  };

  walk(property as unknown as Record<string, unknown>, "");
  return out;
}

export function metricPathsFromFlats(
  flats: Record<string, unknown>[]
): string[] {
  const set = new Set<string>();
  for (const flat of flats) {
    for (const k of Object.keys(flat)) {
      set.add(k);
    }
  }
  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function unionSpecPaths(properties: Property[]): string[] {
  return metricPathsFromFlats(properties.map(flattenPropertySpecs));
}

function camelToWords(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
}

export function humanizeSpecPath(path: string): string {
  return path
    .split(".")
    .map((seg) => camelToWords(seg))
    .filter(Boolean)
    .join(" · ");
}

export function formatSpecValue(raw: unknown): string {
  if (raw === undefined || raw === null) return "\u2014";
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return "\u2014";
    return raw.toLocaleString("en-IN");
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t.length) return "\u2014";
    if (t.length > 200) return `${t.slice(0, 197)}\u2026`;
    return t;
  }
  if (Array.isArray(raw)) {
    if (raw.length === 0) return "\u2014";
    const parts = raw.map((x) => formatSpecValue(x)).filter((x) => x !== "\u2014");
    return parts.length ? parts.join(", ") : "\u2014";
  }
  if (isPlainObject(raw)) {
    try {
      return JSON.stringify(raw);
    } catch {
      return "\u2014";
    }
  }
  return String(raw);
}

export function getSpecAtPath(flat: Record<string, unknown>, path: string): string {
  if (Object.prototype.hasOwnProperty.call(flat, path)) {
    return formatSpecValue(flat[path]);
  }
  return "\u2014";
}

/**
 * Which cells in a row should be highlighted when values differ (minority / not mode).
 */
export function diffHighlightMask(values: string[]): boolean[] {
  if (values.length < 2) return values.map(() => false);
  const counts = new Map<string, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let maxFreq = 0;
  for (const c of counts.values()) {
    if (c > maxFreq) maxFreq = c;
  }
  if (counts.size <= 1) return values.map(() => false);
  /** Every value differs (e.g. A/B/C): highlight all cells. */
  if (maxFreq === 1) return values.map(() => true);
  return values.map((v) => {
    const c = counts.get(v) ?? 0;
    return c < maxFreq;
  });
}
