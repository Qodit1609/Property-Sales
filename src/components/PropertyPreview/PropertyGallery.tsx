import type { Property } from "../../features/properties/propertyType";
import { ImageSlider } from "@/components/common";
import { FALLBACK_PROPERTY_IMAGE } from "../../utils/propertyFormatters";
import { getGalleryImages } from "./previewUtils";

type PropertyGalleryProps = {
  property: Property;
};

const PropertyGallery = ({ property }: PropertyGalleryProps) => {
  const images = getGalleryImages(property);
  const videos = property.media?.videos ?? (property.media?.videoUrl ? [property.media.videoUrl] : property.videos ?? []);
  const droneView = Array.isArray(property.media?.droneView)
    ? property.media?.droneView[0]
    : property.media?.droneView;
  const mapPreview = property.media?.mapPreview ?? property.media?.mapScreenshot ?? property.location?.mapPreview;

  return (
    <div className="space-y-4">
      <ImageSlider
        images={images}
        alt={property.title}
        fallbackImage={FALLBACK_PROPERTY_IMAGE}
        autoPlayMs={5000}
        showThumbnails
      />

      {(videos.length > 0 || droneView || mapPreview) && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {videos[0] && (
            <div className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white">
              <p className="border-b border-[var(--b2-soft)] px-4 py-2 text-sm font-semibold text-[var(--b1)]">
                Video Tour
              </p>
              <video
                controls
                preload="metadata"
                className="h-52 w-full object-cover"
                src={videos[0]}
              />
            </div>
          )}

          {droneView && (
            <a
              href={droneView}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white transition hover:shadow-sm"
            >
              <p className="border-b border-[var(--b2-soft)] px-4 py-2 text-sm font-semibold text-[var(--b1)]">
                Drone View
              </p>
              <div className="flex h-52 items-center justify-center bg-[var(--b2-soft)]/40 px-4 text-center text-sm text-[var(--muted)]">
                Open drone view in new tab
              </div>
            </a>
          )}

          {mapPreview && (
            <div className="overflow-hidden rounded-xl border border-[var(--b2-soft)] bg-white md:col-span-2">
              <p className="border-b border-[var(--b2-soft)] px-4 py-2 text-sm font-semibold text-[var(--b1)]">
                Map Preview
              </p>
              <img
                src={mapPreview}
                alt={`${property.title} map preview`}
                loading="lazy"
                className="h-56 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_PROPERTY_IMAGE;
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
