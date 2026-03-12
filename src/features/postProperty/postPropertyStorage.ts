import type { PostPropertyState } from "./postPropertyTypes";

const STORAGE_KEY = "post_property_draft_v1";

export function loadPostPropertyDraft(): Partial<PostPropertyState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PostPropertyState>;
  } catch {
    return null;
  }
}

export function savePostPropertyDraft(state: PostPropertyState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / serialization issues
  }
}

export function clearPostPropertyDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

