import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/common";
import { useTranslation } from "react-i18next";

function isImageFile(f: File) {
  if (f.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp)$/i.test(f.name);
}

export type DocumentFileKey =
  | "landRegistry"
  | "khasra"
  | "ownership"
  | "previousRegistry"
  | "mutation"
  | "encumbrance"
  | "soil"
  | "water"
  | "irrigation"
  | "electricity"
  | "tax"
  | "noc"
  | "landUse";

type Props = {
  title: string;
  required?: boolean;
  description?: string;
  documentKey: DocumentFileKey;
  file: File | null;
  onFileChange: (key: DocumentFileKey, file: File | null) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploadCard({
  title,
  required = false,
  description,
  documentKey,
  file,
  onFileChange,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(() => (file ? [file] : []));
  const [imageObjectUrls, setImageObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => (isImageFile(f) ? URL.createObjectURL(f) : ""));
    setImageObjectUrls(urls);
    return () => {
      urls.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [files]);

  useEffect(() => {
    if (file === null) {
      setFiles([]);
      return;
    }
    setFiles((prev) => (prev.length === 0 ? [file] : prev));
  }, [file]);

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list?.length) {
        e.target.value = "";
        return;
      }
      const picked = Array.from(list);
      setFiles((prev) => {
        const next = [...prev, ...picked];
        onFileChange(documentKey, next[0] ?? null);
        return next;
      });
      e.target.value = "";
    },
    [documentKey, onFileChange]
  );

  const removeAt = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        onFileChange(documentKey, next[0] ?? null);
        return next;
      });
      if (inputRef.current) inputRef.current.value = "";
    },
    [documentKey, onFileChange]
  );

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "tween", duration: 0.15 }}
      className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[var(--b1)]">{title}</p>
            {required ? (
              <span className="text-xs font-semibold text-[var(--b1-mid)]">*</span>
            ) : (
              <span className="rounded-md border border-[var(--b2)] bg-[var(--b2-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                {t("postProperty.common.optional")}
              </span>
            )}
          </div>
          {description ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
          ) : null}
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            {t("postProperty.documents.fileRules")}
          </p>
          {files.length === 0 ? (
            <p className="mt-1 text-xs italic text-[var(--muted)]">{t("postProperty.documents.noFileSelected")}</p>
          ) : null}
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="sr-only"
            onChange={onPick}
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-[var(--b2)] bg-[var(--b1)] px-3 py-1.5 text-xs font-semibold text-[var(--fg)] hover:bg-[var(--b1-mid)]"
          >
            {t("postProperty.documents.upload")}
          </Button>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.documents.preview")}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {files.map((f, i) => {
              const src = imageObjectUrls[i] ?? "";
              const showImg = isImageFile(f) && Boolean(src);
              return (
                <div
                  key={`${f.name}-${f.size}-${f.lastModified}-${i}`}
                  className="relative w-[min(100%,5.5rem)] flex-shrink-0 overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]"
                >
                  <div className="relative aspect-[4/5] w-full bg-[var(--b2-soft)]/50">
                    {showImg ? (
                      <img
                        src={src}
                        alt={f.name}
                        className="h-full w-full rounded-t-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-t-xl px-2 text-[var(--muted)]">
                        <FileText className="h-10 w-10 opacity-60" strokeWidth={1.25} aria-hidden />
                        <span className="text-[10px] font-medium">{formatFileSize(f.size)}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      aria-label={`${t("postProperty.documents.remove")} ${f.name}`}
                      className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md bg-black/70 text-white shadow-sm transition hover:bg-black/85 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/70 sm:right-2 sm:top-2"
                    >
                      <X className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                  <div className="border-t border-[var(--b2)]/60 bg-[var(--white)] px-2 py-2">
                    <p className="text-[10px] leading-snug text-[var(--b1)] line-clamp-2">
                      <span className="text-[var(--muted)]">{t("postProperty.documents.localPreview")}</span>
                      <span className="text-[var(--muted)]"> • </span>
                      <span className="font-medium text-[var(--b1)]" title={f.name}>
                        {f.name}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--b2)] pt-3">
        <span className="rounded-md border border-[var(--b2)] bg-[var(--b2-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
          {t("postProperty.documents.pendingVerification")}
        </span>
        <span className="text-[10px] text-[var(--muted)]">{t("postProperty.documents.adminRemarks")}: —</span>
        <span className="rounded-md border border-[var(--b2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)] opacity-70">
          {t("postProperty.documents.verifiedPlaceholder")}
        </span>
      </div>
    </motion.div>
  );
}
