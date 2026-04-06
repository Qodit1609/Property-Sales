import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addImages,
  removeImage,
  setMediaUploadError,
  setMediaUploading,
} from "../../features/postProperty/postPropertySlice";
import type { MediaItem } from "../../features/postProperty/postPropertyTypes";
import { uploadPropertyImageAPI } from "../../features/seller/sellerAPI";
import { compressImageFile } from "../propertyPost/imageCompression";
import {
  ALLOWED_PROPERTY_IMAGE_TYPES,
  MAX_PROPERTY_IMAGE_FILE_SIZE_BYTES,
  MAX_PROPERTY_IMAGES,
  makeMediaItemId,
  sha256Hex,
} from "../../lib/propertyImageUpload";

export default function SellerDashboardImageUploader() {
  const dispatch = useAppDispatch();
  const media = useAppSelector((s) => s.postProperty.media);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const canUpload = useMemo(
    () => media.images.length < MAX_PROPERTY_IMAGES && !media.uploading,
    [media.images.length, media.uploading]
  );

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;

    const remaining = MAX_PROPERTY_IMAGES - media.images.length;
    if (remaining <= 0) {
      dispatch(setMediaUploadError(`Only ${MAX_PROPERTY_IMAGES} images are allowed.`));
      return;
    }

    const queue = list.slice(0, remaining);
    const failures: string[] = [];
    const items: MediaItem[] = [];
    const existingHashes = new Set(
      media.images.map((img) => img.hash).filter((hash): hash is string => Boolean(hash))
    );
    const batchHashes = new Set<string>();

    dispatch(setMediaUploading(true));
    dispatch(setMediaUploadError(null));
    setProgressMap({});

    try {
      for (const [index, file] of queue.entries()) {
        const key = `${file.name}-${index}`;
        setProgressMap((prev) => ({ ...prev, [key]: 0 }));

        if (!ALLOWED_PROPERTY_IMAGE_TYPES.has(file.type)) {
          failures.push(`${file.name}: invalid file type`);
          setProgressMap((prev) => ({ ...prev, [key]: 100 }));
          continue;
        }
        if (file.size > MAX_PROPERTY_IMAGE_FILE_SIZE_BYTES) {
          failures.push(`${file.name}: file size exceeds 10MB`);
          setProgressMap((prev) => ({ ...prev, [key]: 100 }));
          continue;
        }

        try {
          const fileHash = await sha256Hex(file);
          if (existingHashes.has(fileHash) || batchHashes.has(fileHash)) {
            failures.push(`${file.name}: duplicate skipped`);
            setProgressMap((prev) => ({ ...prev, [key]: 100 }));
            continue;
          }

          const compressed = await compressImageFile(file);
          const uploadFile = new File([compressed], file.name, {
            type: compressed.type || file.type,
            lastModified: Date.now(),
          });
          const url = await uploadPropertyImageAPI({
            file: uploadFile,
            tag: "property",
            name: file.name,
            altText: "Property image",
            onUploadProgress: (percent: number) =>
              setProgressMap((prev) => ({ ...prev, [key]: percent })),
          });

          items.push({
            id: makeMediaItemId(),
            url,
            source: "remote",
            fileName: file.name,
            sizeBytes: uploadFile.size,
            mimeType: uploadFile.type,
            hash: fileHash,
          });
          batchHashes.add(fileHash);
          setProgressMap((prev) => ({ ...prev, [key]: 100 }));
        } catch (error: unknown) {
          const detail = error instanceof Error ? error.message : "upload failed";
          failures.push(`${file.name}: ${detail}`);
          setProgressMap((prev) => ({ ...prev, [key]: 100 }));
        }
      }

      if (items.length) {
        dispatch(addImages(items));
      }
      if (failures.length) {
        dispatch(setMediaUploadError(failures.join("; ")));
      }
      if (list.length > queue.length) {
        dispatch(
          setMediaUploadError(
            `${failures.join("; ")}${failures.length ? "; " : ""}${list.length - queue.length} file(s) skipped due to ${MAX_PROPERTY_IMAGES}-image limit`
          )
        );
      }
    } finally {
      dispatch(setMediaUploading(false));
      setTimeout(() => setProgressMap({}), 1200);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--b1)]">Quick Image Upload</h2>
          <p className="text-xs text-[var(--muted)]">
            Upload from dashboard. These images are used in post-property media step.
          </p>
        </div>
        <Link
          to="/post-property/media"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--b1-mid)] hover:underline"
        >
          Open full media step
        </Link>
      </div>

      <div className="mt-4">
        <p className="text-xs text-[var(--muted)]">JPG/PNG/WEBP/GIF, max 10MB, up to 5 images.</p>
        <label
          className={`mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
            canUpload ? "bg-[var(--b1-mid)] hover:bg-[var(--b1)]" : "bg-[var(--muted)]/50"
          }`}
        >
          <Upload className="h-4 w-4" />
          Select images ({media.images.length}/{MAX_PROPERTY_IMAGES})
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            disabled={!canUpload}
            className="hidden"
            onChange={(e) => {
              if (!e.target.files) return;
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {media.uploadError && (
        <p className="mt-3 rounded-md border border-[var(--error)]/40 bg-[var(--error-bg)] px-3 py-2 text-xs text-[var(--error)]">
          {media.uploadError}
        </p>
      )}

      {Object.keys(progressMap).length > 0 && (
        <div className="mt-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-3">
          <p className="text-xs font-semibold text-[var(--b1)]">Uploading</p>
          <div className="mt-2 space-y-2">
            {Object.entries(progressMap).map(([name, percent]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="truncate text-[11px] text-[var(--muted)]">{name}</p>
                  <p className="text-[11px] font-semibold text-[var(--b1)]">{percent}%</p>
                </div>
                <progress
                  className="h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-[var(--b2)]/70 [&::-webkit-progress-value]:bg-[var(--b1-mid)] [&::-moz-progress-bar]:bg-[var(--b1-mid)]"
                  max={100}
                  value={percent}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {media.images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded-xl border border-[var(--b2)]">
            <img src={img.url} alt={img.fileName ?? "Property"} className="h-24 w-full object-cover" />
            <button
              type="button"
              onClick={() => dispatch(removeImage(img.id))}
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black/85"
              aria-label={`Remove image ${img.fileName ?? ""}`.trim()}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!media.images.length && (
          <div className="col-span-2 rounded-lg border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-3 text-xs text-[var(--muted)] sm:col-span-3 lg:col-span-5">
            No images uploaded yet.
          </div>
        )}
      </div>
    </section>
  );
}

