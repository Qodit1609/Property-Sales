/** Word limits for property listing copy (aligned with UI and validation). */
export const MAX_PROPERTY_DESCRIPTION_WORDS = 150;
export const MAX_PROPERTY_SHORT_DESCRIPTION_WORDS = 40;

/** Readable wrap for property descriptions (whole words; overflow only when unavoidable). */
export const PROPERTY_TEXT_WRAP_CLASS =
  "min-w-0 break-words whitespace-pre-wrap [overflow-wrap:break-word] [word-break:normal]";

const WORD_PATTERN = /\S+/g;

function getWords(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

/** Counts words; collapses extra spaces and newlines between tokens. */
export function countWords(text: string): number {
  return getWords(text ?? "").length;
}

/**
 * Returns up to `limit` words; if text exceeds `limit`, joins those words and appends "...".
 */
export function truncateWords(text: string, limit: number): string {
  if (limit <= 0) return "";
  const source = text ?? "";
  const words = getWords(source);
  if (words.length === 0) return "";
  if (words.length <= limit) return source;
  return `${words.slice(0, limit).join(" ")}...`;
}

/** Caps input at `maxWords` words (used while typing); preserves text when under the limit. */
export function clampWords(text: string, maxWords: number): string {
  if (maxWords <= 0) return "";
  const words = getWords(text ?? "");
  if (words.length <= maxWords) return text ?? "";
  return words.slice(0, maxWords).join(" ");
}
