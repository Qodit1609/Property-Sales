import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { properties } from "../Data/properties";
import type { Property, ExtendedProperty } from "../Data/properties";

type MediaType = "gallery" | "map" | "video";

const PropertyPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = properties.find(p => p._id === id) as
    | (Property & ExtendedProperty)
    | undefined;

  const [activeMedia, setActiveMedia] = useState<MediaType>("gallery");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!property) {
    return (
      <div className="pt-24 text-center">
        <p className="text-lg font-semibold text-[var(--b1)]">
          Property not found
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 rounded-full bg-[var(--b1-mid)] text-[var(--fg)] text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const googleMapEmbed = `https://www.google.com/maps?&q=${encodeURIComponent(
    property.address
  )}&z=15&output=embed`;

  return (
    <div className="pt-20 sm:pt-24 bg-[var(--fg)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Media Section */}
        <div className="relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] rounded-xl overflow-hidden bg-black">
          {activeMedia === "gallery" && (
            <>
              <img
                src={property.media.gallery[currentImage]}
                alt={property.title}
                className="h-full w-full object-cover"
              />

              {property.media.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage(p =>
                        p === 0 ? property.media.gallery.length - 1 : p - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--b2-soft)]/90 px-3 py-1 rounded-full text-sm text-[var(--b1)]"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage(
                        p => (p + 1) % property.media.gallery.length
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--b2-soft)]/90 px-3 py-1 rounded-full text-sm text-[var(--b1)]"
                  >
                    ›
                  </button>
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

          {activeMedia === "video" && property.media.videoUrl && (
            <video
              src={property.media.videoUrl}
              controls
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-[var(--b2-soft)]/90 p-1.5 rounded-full">
              <MediaButton
                label="Gallery"
                active={activeMedia === "gallery"}
                onClick={() => setActiveMedia("gallery")}
              />
              <MediaButton
                label="Map"
                active={activeMedia === "map"}
                onClick={() => setActiveMedia("map")}
              />
              {property.media.videoUrl && (
                <MediaButton
                  label="Video"
                  active={activeMedia === "video"}
                  onClick={() => setActiveMedia("video")}
                />
              )}
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

            <p className="text-sm text-[var(--b2)] leading-relaxed">
              {property.address}
            </p>

            <p className="text-2xl font-bold">
              ₹ {property.price.toLocaleString("en-IN")}
            </p>

            <p className="text-sm">
              <span className="font-medium">Land size:</span>{" "}
              {property.landSize}
            </p>
          </div>

          {/* Contact Agent */}
          <div className="bg-[var(--b2-soft)] text-[var(--b1)] rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">
              Contact agent
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={property.agent.image}
                alt={property.agent.name}
                className="h-14 w-14 rounded-full object-cover"
              />

              <div className="space-y-1">
                <p className="text-base font-semibold">
                  {property.agent.name}
                </p>
                <p className="text-sm leading-snug">
                  {property.agent.phone}
                </p>
                <p className="text-sm leading-snug break-all">
                  {property.agent.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About + Highlights */}
        <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold">
              About this property
            </h2>
            <p className="text-sm leading-relaxed">
              {property.aboutProperty}
            </p>
          </div>

          <div className="bg-[var(--b2-soft)] rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold">
              Property highlights
            </h3>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li>• Soil type: {property.highlights.soilType}</li>
              <li>• Water availability: {property.highlights.waterAvailability ? "Yes" : "No"}</li>
              <li>• Electricity: {property.highlights.electricityAvailable ? "Yes" : "No"}</li>
              <li>• Road access: {property.highlights.roadAccess ? "Yes" : "No"}</li>
              <li>• Land type: {property.highlights.landType}</li>
            </ul>
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
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
      active
        ? "bg-[var(--b1-mid)] text-[var(--fg)]"
        : "bg-[var(--b2-soft)] text-[var(--b1)]"
    }`}
  >
    {label}
  </button>
);
