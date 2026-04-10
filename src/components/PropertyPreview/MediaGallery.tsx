import { useTranslation } from "react-i18next";

type MediaGalleryProps = {
  title: string;
  images?: string[];
  videos?: string[];
  droneView?: string | string[];
  mapScreenshot?: string;
};

const toArray = (value?: string | string[]) => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value.filter(Boolean) : [value];
};

const MediaGallery = ({ title, images = [], videos = [], droneView, mapScreenshot }: MediaGalleryProps) => {
  const { t } = useTranslation();
  const droneItems = toArray(droneView);
  const hasAnyMedia = images.length || videos.length || droneItems.length || mapScreenshot;

  if (!hasAnyMedia) {
    return <p className="text-sm text-[var(--muted)]">{t("propertyPreview.labels.notAvailable")}</p>;
  }

  return (
    <div className="space-y-4">
      {images.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-[var(--b1)]">{title} {t("propertyPreview.labels.images")}</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`${title} ${index + 1}`}
                className="h-36 w-56 shrink-0 rounded-lg border border-[var(--b2-soft)] object-cover"
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.slice(0, 3).map((videoSrc, index) => (
          <video
            key={`${videoSrc}-${index}`}
            controls
            preload="metadata"
            className="h-44 w-full rounded-lg border border-[var(--b2-soft)] bg-black object-cover"
          >
            <source src={videoSrc} />
          </video>
        ))}

        {droneItems.slice(0, 1).map((droneSrc, index) => (
          <a
            key={`${droneSrc}-${index}`}
            href={droneSrc}
            target="_blank"
            rel="noreferrer"
            className="flex h-44 items-center justify-center rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-4 text-center text-sm font-semibold text-[var(--b1)]"
          >
            {t("propertyPreview.actions.viewDronePreview")}
          </a>
        ))}

        {mapScreenshot ? (
          <a
            href={mapScreenshot}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-lg border border-[var(--b2-soft)]"
          >
            <img
              src={mapScreenshot}
              alt={`${title} map screenshot`}
              className="h-44 w-full object-cover"
            />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default MediaGallery;
