import { BASE_URL } from "./apiClient";

type TranslateLang = "en" | "hi";

const MAX_CHUNK_LENGTH = 450;
const MAX_CONCURRENT_REQUESTS = 4;
const memoryCache = new Map<string, string>();

let activeRequests = 0;
const waitQueue: Array<() => void> = [];

const containsDevanagari = (text: string): boolean => /[\u0900-\u097F]/.test(text);

const cacheKey = (text: string, from: TranslateLang, to: TranslateLang) =>
  `${from}|${to}|${text}`;

const readSessionCache = (key: string): string | undefined => {
  try {
    return sessionStorage.getItem(`bw_tr:${key}`) ?? undefined;
  } catch {
    return undefined;
  }
};

const writeSessionCache = (key: string, value: string) => {
  try {
    sessionStorage.setItem(`bw_tr:${key}`, value);
  } catch {
    // ignore quota errors
  }
};

const acquireSlot = async (): Promise<void> => {
  if (activeRequests < MAX_CONCURRENT_REQUESTS) {
    activeRequests += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    waitQueue.push(resolve);
  });
  activeRequests += 1;
};

const releaseSlot = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  const next = waitQueue.shift();
  if (next) {
    next();
  }
};

const chunkText = (text: string): string[] => {
  if (text.length <= MAX_CHUNK_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > MAX_CHUNK_LENGTH) {
    let splitAt = remaining.lastIndexOf(". ", MAX_CHUNK_LENGTH);
    if (splitAt < MAX_CHUNK_LENGTH * 0.4) {
      splitAt = remaining.lastIndexOf(" ", MAX_CHUNK_LENGTH);
    }
    if (splitAt < MAX_CHUNK_LENGTH * 0.4) {
      splitAt = MAX_CHUNK_LENGTH;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks.filter(Boolean);
};

const translateViaBackend = async (
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: { translated?: string };
    };

    const translated = payload.data?.translated?.trim();
    return translated || null;
  } catch {
    return null;
  }
};

const translateViaMyMemory = async (
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string | null> => {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number;
      quotaFinished?: boolean;
    };

    if (payload.quotaFinished || payload.responseStatus === 429) {
      return null;
    }

    const translated = payload.responseData?.translatedText?.trim();
    if (!translated || translated.toUpperCase().includes("MYMEMORY WARNING")) {
      return null;
    }

    return translated;
  } catch {
    return null;
  }
};

const translateChunk = async (
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> => {
  const key = cacheKey(text, from, to);
  const cached = memoryCache.get(key) ?? readSessionCache(key);
  if (cached) {
    return cached;
  }

  await acquireSlot();
  let translated: string | null = null;
  try {
    translated = await translateViaBackend(text, from, to);
    if (!translated) {
      translated = await translateViaMyMemory(text, from, to);
    }
  } finally {
    releaseSlot();
  }

  const result = translated?.trim() || text;
  memoryCache.set(key, result);
  writeSessionCache(key, result);
  return result;
};

/** Translates free-form API text between English and Hindi with caching. */
export const translateFreeText = async (
  text: string,
  from: TranslateLang,
  to: TranslateLang,
): Promise<string> => {
  const trimmed = text.trim();
  if (!trimmed || from === to) {
    return trimmed;
  }

  const chunks = chunkText(trimmed);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    translatedChunks.push(await translateChunk(chunk, from, to));
  }

  return translatedChunks.join(chunks.length > 1 ? " " : "");
};

export const resolveFreeTextForLanguage = async (
  text: string | undefined,
  language: TranslateLang,
): Promise<string> => {
  const trimmed = text?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  const isHindi = containsDevanagari(trimmed);

  if (language === "en") {
    return isHindi ? translateFreeText(trimmed, "hi", "en") : trimmed;
  }

  return isHindi ? trimmed : translateFreeText(trimmed, "en", "hi");
};
