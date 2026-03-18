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
import { blobToDataUrl, compressImageFile } from "./imageCompression";
import type { MediaItem } from "../../features/postProperty/postPropertyTypes";
import { Input, Button } from "@/components/common";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function MediaUpload() {
  const { pushToast } = useOutletContext<PostPropertyOutletContext>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const media = useAppSelector((s) => s.postProperty.media);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const errors = useMemo(() => validateMedia(media), [media]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!list.length) {
        pushToast({ kind: "error", title: "Only images supported", detail: "Please select image files." });
        return;
      }

      dispatch(setMediaUploading(true));
      dispatch(setMediaUploadError(null));
      try {
        const items: MediaItem[] = [];
        for (const file of list) {
          const compressed = await compressImageFile(file);
          const url = await blobToDataUrl(compressed);
          items.push({
            id: makeId(),
            url,
            source: "local" as const,
            fileName: file.name,
            sizeBytes: compressed.size,
            mimeType: compressed.type,
          });
        }
        dispatch(addImages(items));
        pushToast({ kind: "success", title: "Images added", detail: `${items.length} image(s) ready.` });
      } catch {
        dispatch(setMediaUploadError("Failed to process images"));
        pushToast({ kind: "error", title: "Upload failed", detail: "Could not process selected images." });
      } finally {
        dispatch(setMediaUploading(false));
      }
    },
    [dispatch, pushToast]
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
        title: "Add at least one image URL",
        detail:
          "Your server currently expects image URLs. Add an image URL (upload service will be integrated later).",
      });
      return;
    }
    dispatch(markStepCompleted("media"));
    dispatch(saveDraftNow());
    pushToast({ kind: "success", title: "Draft saved" });
    navigate("/post-property/amenities");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--b1)]">Step 4: Media</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Upload high-quality images. Images are compressed on-device for faster uploads.
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
                <p className="text-sm font-semibold text-[var(--b1)]">Drag & drop images</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Or browse from your computer. Multiple images supported.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition">
                Select files
                <Input type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />
              </label>
            </div>

            {errors.images && (
              <p className="mt-3 text-xs font-semibold text-[var(--error)]">{errors.images}</p>
            )}

            {media.uploadError && (
              <p className="mt-3 text-xs font-semibold text-[var(--error)]">{media.uploadError}</p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-5">
            <p className="text-sm font-semibold text-[var(--b1)]">Add image by URL</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Until a backend upload service is connected, please add at least one public image URL.
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
                      title: "Invalid URL",
                      detail: "Please enter a valid http/https image URL.",
                    });
                    return;
                  }
                  dispatch(
                    addImages([
                      { id: makeId(), url, source: "remote", fileName: "remote-image" },
                    ])
                  );
                  setImageUrl("");
                  pushToast({ kind: "success", title: "Image URL added" });
                }}
                className="rounded-md bg-[var(--b1-mid)] px-4 py-2 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--b1)] transition"
              >
                Add URL
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--b1)]">Preview</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {media.images.map((img) => (
                <div key={img.id} className="relative overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]">
                  <img src={img.url} alt={img.fileName ?? "Property"} className="h-28 w-full object-cover" />
                  <Button
                    type="button"
                    onClick={() => dispatch(removeImage(img.id))}
                    className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white hover:bg-black/80"
                  >
                    Delete
                  </Button>
                  <div className="px-2 py-2">
                    <p className="text-[10px] text-[var(--muted)] line-clamp-1">
                      {img.source === "remote" ? "URL image" : "Local preview"} •{" "}
                      {img.fileName ?? "image"}
                    </p>
                  </div>
                </div>
              ))}
              {!media.images.length && (
                <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-4 text-sm text-[var(--muted)]">
                  No images added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm p-5">
          <p className="text-sm font-semibold text-[var(--b1)]">Optional video</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Paste a video link (YouTube/Drive). Upload service integration can be added later.
          </p>
          <Input
            value={media.videoUrl ?? ""}
            onChange={(e) => dispatch(setVideoUrl(e.target.value))}
            placeholder="https://..."
            className="mt-3 w-full rounded-md border border-[var(--b2)] px-3 py-2 text-sm bg-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
          />

          <div className="mt-5 rounded-xl bg-[var(--b2-soft)]/40 p-4">
            <p className="text-xs font-semibold text-[var(--b1)]">Tip</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Add 6–10 clear images (front, access road, nearby landmark, land view).
            </p>
          </div>
        </div>
      </div>

      <FormActions
        onBack={() => navigate("/post-property/profile")}
        onNext={onNext}
        nextLabel="Continue"
        nextDisabled={media.uploading}
        nextLoading={media.uploading}
      />
    </div>
  );
}

