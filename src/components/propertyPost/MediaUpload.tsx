import { useCallback, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addImages,
  removeImage,
  markStepCompleted,
  saveDraftNow,
  setMediaUploadError,
  setMediaUploading,
  setVideoUrl,
} from "../../features/postProperty/postPropertySlice";
import { validateMedia } from "../../features/postProperty/postPropertyValidation";
import FormActions from "./FormActions";
import type { PostPropertyOutletContext } from "./postPropertyOutletContext";
import { compressImageFile } from "./imageCompression";
import type { MediaItem } from "../../features/postProperty/postPropertyTypes";
import { Input, Button } from "@/components/common";
import { X } from "lucide-react";
import { uploadPropertyImageAPI } from "../../features/seller/sellerAPI";
import {
  ALLOWED_PROPERTY_IMAGE_TYPES,
  MAX_PROPERTY_IMAGE_FILE_SIZE_BYTES,
  MAX_PROPERTY_IMAGES,
  makeMediaItemId,
  sha256Hex,
} from "../../lib/propertyImageUpload";
import { useTranslation } from "react-i18next";

export default function MediaUpload() {
  const { t } = useTranslation();
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const media = useAppSelector((s) => s.postProperty.media);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const errors = useMemo(() => validateMedia(media), [media]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) {
        pushToast({ kind: "error", title: t("postProperty.media.onlyImagesSupported"), detail: t("postProperty.media.selectImageFiles") });
        return;
      }
      const remaining = MAX_PROPERTY_IMAGES - media.images.length;
      if (remaining <= 0) {
        dispatch(setMediaUploadError(`Only ${MAX_PROPERTY_IMAGES} images are allowed.`));
        pushToast({ kind: "error", title: t("postProperty.media.uploadLimitReached"), detail: t("postProperty.media.uploadLimitDetail", { count: MAX_PROPERTY_IMAGES }) });
        return;
      }
      const queue = list.slice(0, remaining);
      const failures: string[] = [];
      const existingHashes = new Set(
        media.images.map((img) => img.hash).filter((hash): hash is string => Boolean(hash))
      );
      const batchHashes = new Set<string>();

      dispatch(setMediaUploading(true));
      dispatch(setMediaUploadError(null));
      setProgressMap({});
      try {
        const items: MediaItem[] = [];
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

          const compressed = await compressImageFile(file);
          const uploadFile = new File([compressed], file.name, {
            type: compressed.type || file.type,
            lastModified: Date.now(),
          });
          const fileHash = await sha256Hex(uploadFile);
          if (existingHashes.has(fileHash) || batchHashes.has(fileHash)) {
            failures.push(`${file.name}: duplicate skipped`);
            setProgressMap((prev) => ({ ...prev, [key]: 100 }));
            continue;
          }
          const url = await uploadPropertyImageAPI({
            file: uploadFile,
            tag: "property",
            name: file.name,
            altText: t("postProperty.media.propertyImageAlt"),
            onUploadProgress: (percent: number) =>
              setProgressMap((prev) => ({ ...prev, [key]: percent })),
          });
          items.push({
            id: makeMediaItemId(),
            url,
            source: "remote" as const,
            fileName: file.name,
            sizeBytes: uploadFile.size,
            mimeType: uploadFile.type,
            hash: fileHash,
          });
          batchHashes.add(fileHash);
          setProgressMap((prev) => ({ ...prev, [key]: 100 }));
        }
        if (items.length) {
          dispatch(addImages(items));
          pushToast({ kind: "success", title: t("postProperty.media.imagesUploaded"), detail: t("postProperty.media.imagesUploadedDetail", { count: items.length }) });
        }
        if (list.length > queue.length) {
          failures.push(`${list.length - queue.length} file(s) skipped due to ${MAX_PROPERTY_IMAGES}-image limit`);
        }
        if (failures.length) {
          const message = failures.join("; ");
          dispatch(setMediaUploadError(message));
          pushToast({ kind: "error", title: t("postProperty.media.someUploadsFailed"), detail: message });
        }
      } catch (error: unknown) {
        const detail = error instanceof Error ? error.message : t("postProperty.media.couldNotUploadSelectedImages");
        dispatch(setMediaUploadError(`${t("postProperty.media.uploadFailedPrefix")}: ${detail}. ${t("postProperty.media.pasteImageUrlHint")}`));
        pushToast({ kind: "error", title: t("postProperty.media.uploadFailed"), detail });
      } finally {
        dispatch(setMediaUploading(false));
        setTimeout(() => setProgressMap({}), 1200);
      }
    },
    [dispatch, media.images, pushToast]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    void handleFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      void handleFiles(e.dataTransfer.files);
    }
  };

  const onNext = () => {
    if (Object.keys(errors).length > 0) {
      pushToast({
        kind: "error",
        title: t("postProperty.media.addAtLeastOneImage"),
        detail: t("postProperty.media.addAtLeastOneImageDetail"),
      });
      return;
    }
    dispatch(markStepCompleted("media"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: t("postProperty.toast.draftSaved") });
    navigate("/post-property/documents");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">{t("postProperty.media.stepTitle")}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {t("postProperty.media.stepSubtitle")}
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`rounded-2xl border border-dashed p-6 transition ${
              dragOver ? "border-[var(--b1-mid)] bg-[var(--b2-soft)]" : "border-[var(--b2)] bg-[var(--white)]"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.media.dragDropImages")}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {t("postProperty.media.browseFromComputer")}
                </p>
              </div>

              <label className="inline-flex min-w-[116px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition hover:bg-[var(--b1)]">
                {t("postProperty.media.selectFiles")}
                <input type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />
              </label>
            </div>

            {errors.images && (
              <p className="mt-3 text-xs font-semibold text-[var(--error)]">{t(errors.images)}</p>
            )}

            {media.uploadError && (
              <p className="mt-3 text-xs font-semibold text-[var(--error)]">{media.uploadError}</p>
            )}
          </div>

          {Object.keys(progressMap).length > 0 && (
            <div className="mt-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/30 p-3">
              <p className="text-xs font-semibold text-[var(--b1)]">{t("postProperty.media.uploading")}</p>
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

          <div className="mt-5 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.media.addImageByUrl")}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {t("postProperty.media.addImageByUrlHint")}
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
              <Button
                type="button"
                onClick={() => {
                  const url = imageUrl.trim();
                  if (!url || !/^https?:\/\//i.test(url)) {
                    pushToast({
                      kind: "error",
                    title: t("postProperty.media.invalidUrl"),
                    detail: t("postProperty.media.invalidUrlDetail"),
                    });
                    return;
                  }
                  dispatch(
                    addImages([
                      { id: makeMediaItemId(), url, source: "remote", fileName: "remote-image" },
                    ])
                  );
                  setImageUrl("");
                  pushToast({ kind: "success", title: t("postProperty.media.imageUrlAdded") });
                }}
                className="min-w-[104px] shrink-0 whitespace-nowrap rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition hover:bg-[var(--b1)]"
              >
                {t("postProperty.media.addUrl")}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.media.preview")}</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {media.images.map((img) => (
                <div key={img.id} className="relative overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]">
                  <img src={img.url} alt={img.fileName ?? t("postProperty.media.propertyImageAlt")} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => dispatch(removeImage(img.id))}
                    aria-label={`${t("postProperty.media.removeImage")} ${img.fileName ?? ""}`.trim()}
                    className="absolute right-1.5 top-1.5 inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-md bg-black/70 text-white shadow-sm transition hover:bg-black/85 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/70 sm:right-2 sm:top-2 sm:h-8 sm:w-8"
                  >
                    <X className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  </button>
                  <div className="px-2 py-2">
                    <p className="text-[10px] text-[var(--muted)] line-clamp-1">
                      {img.source === "remote" ? t("postProperty.media.uploadedImage") : t("postProperty.media.localPreview")} •{" "}
                      {img.fileName ?? t("postProperty.media.image")}
                    </p>
                  </div>
                </div>
              ))}
              {!media.images.length && (
                <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-4 text-sm text-[var(--muted)]">
                  {t("postProperty.media.noImagesYet")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm p-5">
          <p className="text-sm font-semibold text-[var(--b1)]">{t("postProperty.media.optionalVideo")}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("postProperty.media.optionalVideoHint")}
          </p>
          <Input
            value={media.videoUrl ?? ""}
            onChange={(e) => dispatch(setVideoUrl(e.target.value))}
            placeholder="https://..."
            className="mt-3 w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />

          <div className="mt-5 rounded-xl bg-[var(--b2-soft)]/40 p-4">
            <p className="text-xs font-semibold text-[var(--b1)]">{t("postProperty.media.tip")}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {t("postProperty.media.tipText")}
            </p>
          </div>
        </div>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/profile")}
        onNext={onNext}
        nextLabel={t("postProperty.common.continue")}
        nextDisabled={media.uploading}
        nextLoading={media.uploading}
      />
    </div>
  );
}

