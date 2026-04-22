import React, { useCallback, useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/common";
import { ToastStack, type ToastMessage } from "@/components/propertyPost/Toast";
import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/lib/apiClient";

type MediaImage = {
  id: string;
  url: string;
  name?: string;
  tag?: string;
  format?: string;
  width?: number;
  height?: number;
  createdAt?: string;
};

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const toIdString = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object") {
    const rec = value as Record<string, unknown>;
    const oid = rec.$oid;
    if (typeof oid === "string" && oid.trim()) return oid.trim();
    const nested = rec._id ?? rec.id;
    if (typeof nested === "string" && nested.trim()) return nested.trim();
  }
  return null;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const extractMediaList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const root = toRecord(payload);
  const data = toRecord(root.data);
  if (Array.isArray(data.mediaAssets)) return data.mediaAssets;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(root.mediaAssets)) return root.mediaAssets;
  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(data.list)) return data.list;
  if (Array.isArray(root.list)) return root.list;
  return [];
};

const mapMediaItem = (raw: unknown): MediaImage | null => {
  const item = toRecord(raw);
  const id =
    toIdString(item._id) ??
    toIdString(item.id) ??
    toIdString(item.mediaId) ??
    toIdString(item.assetId);
  const urlRaw = item.cloudinaryUrl ?? item.secure_url ?? item.url ?? item.src;
  const url = typeof urlRaw === "string" ? urlRaw.trim() : "";
  if (!id || !url) return null;

  const createdAt = item.createdAt;
  return {
    id,
    url,
    name: typeof item.name === "string" ? item.name : undefined,
    tag: typeof item.tag === "string" ? item.tag : undefined,
    format: typeof item.format === "string" ? item.format : undefined,
    width: toNumber(item.width),
    height: toNumber(item.height),
    createdAt: typeof createdAt === "string" ? createdAt : undefined,
  };
};

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
};

const AdminImagesPage: React.FC = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/media");
      const list = extractMediaList(res.data);
      const mapped = list.map(mapMediaItem).filter((x): x is MediaImage => Boolean(x));
      setImages(mapped);
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Load failed",
        detail: error instanceof Error ? error.message : "Unable to fetch images",
      });
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      pushToast({ kind: "success", title: "Image uploaded" });
      await loadImages();
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Upload failed",
        detail: error instanceof Error ? error.message : "Unable to upload image",
      });
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (image: MediaImage) => {
    const confirmed = window.confirm("Delete this image permanently?");
    if (!confirmed) return;

    setDeletingId(image.id);
    try {
      await api.delete(`/media/${encodeURIComponent(image.id)}`);
      pushToast({ kind: "success", title: "Image deleted" });
      await loadImages();
    } catch (error) {
      pushToast({
        kind: "error",
        title: "Delete failed",
        detail: error instanceof Error ? error.message : "Unable to delete image",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Images">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <section className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--b1)]">Images</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">Manage uploaded media images.</p>
          </div>
          <label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void onUpload(e)}
            />
            <span>
              <Button type="button" variant="outline" size="sm" disabled={uploading}>
                <Upload className="mr-1 h-4 w-4" />
                {uploading ? "Uploading..." : "Add Image"}
              </Button>
            </span>
          </label>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No images found.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => {
              const createdAt = formatDate(image.createdAt);
              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)]"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--b2-soft)]/40">
                    <img src={image.url} alt={image.name || "Media"} className="h-full w-full object-cover" />
                  </div>

                  <div className="space-y-1 p-3">
                    {image.name ? <p className="line-clamp-1 text-sm font-medium text-[var(--b1)]">{image.name}</p> : null}
                    {image.tag ? <p className="text-xs text-[var(--muted)]">Tag: {image.tag}</p> : null}
                    {image.format ? <p className="text-xs text-[var(--muted)]">Format: {image.format}</p> : null}
                    {image.width && image.height ? (
                      <p className="text-xs text-[var(--muted)]">
                        Size: {image.width} x {image.height}
                      </p>
                    ) : null}
                    {createdAt ? <p className="text-xs text-[var(--muted)]">Created: {createdAt}</p> : null}
                  </div>

                  <div className="border-t border-[var(--b2)] p-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      disabled={deletingId === image.id}
                      onClick={() => void onDelete(image)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      {deletingId === image.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AdminLayout>
  );
};

export default AdminImagesPage;
