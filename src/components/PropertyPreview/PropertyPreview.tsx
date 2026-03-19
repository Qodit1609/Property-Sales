import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Property } from "../../features/properties/propertyType";
import { Input, Button } from "@/components/common";
import Header from "../Header/Header";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' fill='%23e2e8f0'%3E%3Crect width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2394a3b8'%3EImage Not Available%3C/text%3E%3C/svg%3E";

type MediaType = "gallery" | "map" | "video";

type Props = {
  property: Property;
};

const PropertyPreview = ({ property }: Props) => {
  const navigate = useNavigate();

  const [activeMedia, setActiveMedia] = useState<MediaType>("gallery");
  const [currentImage, setCurrentImage] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const handleImageError = useCallback(
    (src: string) => setBrokenImages((prev) => new Set(prev).add(src)),
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const gallery = property.images ?? [];

  const googleMapEmbed = `https://www.google.com/maps?&q=${encodeURIComponent(
    property.address
  )}&z=15&output=embed`;

  if (!property) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg font-semibold text-[var(--b1)]">
          Property not found
        </p>
        <Button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 rounded-full bg-[var(--b1-mid)] text-[var(--fg)] text-sm"
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 bg-[var(--fg)]">
      <Header forceSolid/>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Media Section */}
        <div className="relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] rounded-xl overflow-hidden bg-black">

          {activeMedia === "gallery" && gallery.length > 0 && (
            <>
              <img
                src={
                  brokenImages.has(gallery[currentImage])
                    ? FALLBACK_IMAGE
                    : gallery[currentImage]
                }
                alt={property.title}
                onError={() => handleImageError(gallery[currentImage])}
                className="h-full w-full object-cover"
              />

              {gallery.length > 1 && (
                <>
                  <Button
                    onClick={() =>
                      setCurrentImage((i) =>
                        i === 0 ? gallery.length - 1 : i - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--b2-soft)]/90 px-3 py-1 rounded-full text-sm"
                  >
                    ‹
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentImage((i) => (i + 1) % gallery.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--b2-soft)]/90 px-3 py-1 rounded-full text-sm"
                  >
                    ›
                  </Button>
                </>
              )}
            </>
          )}

          {activeMedia === "map" && (
            <iframe
              src={googleMapEmbed}
              className="h-full w-full border-0"
              loading="lazy"
            />
          )}

          {/* Media Switcher */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-[var(--b2-soft)]/90 p-1.5 rounded-full">
              {gallery.length > 0 && (
                <MediaButton
                  label="Gallery"
                  active={activeMedia === "gallery"}
                  onClick={() => setActiveMedia("gallery")}
                />
              )}
              <MediaButton
                label="Map"
                active={activeMedia === "map"}
                onClick={() => setActiveMedia("map")}
              />
            </div>
          </div>
        </div>

        {/* Property + Agent */}
        <div className="mt-5 bg-[var(--b1)] text-[var(--fg)] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Property Info */}
          <div className="lg:col-span-2 space-y-3">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {property.title}
            </h1>

            <p className="text-sm text-[var(--b2)]">
              {property.address}
            </p>

            <p className="text-2xl font-bold">
              ₹ {property.price.toLocaleString("en-IN")}
            </p>

            {property.size && (
              <p className="text-sm">
                <span className="font-medium">Size:</span> {property.size}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PropertyPreview;

const MediaButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
      active
        ? "bg-[var(--b1-mid)] text-[var(--fg)]"
        : "bg-[var(--b2-soft)] text-[var(--b1)]"
    }`}
  >
    {label}
  </Button>
);
