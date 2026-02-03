import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Agent {
  name: string;
  location: string;
  phone: string;
  image: string;
}

interface PropertyPreviewProps {
  id: number;
  title: string;
  address: string;
  priceRange: string;
  images: string[];
  mapUrl?: string;
  videoUrl?: string;
  agent: Agent;
}

type MediaType = "gallery" | "map" | "video";

const PropertyPreview = ({
  id,
  title,
  address,
  priceRange,
  images,
  videoUrl,
  agent,
}: PropertyPreviewProps) => {
  const navigate = useNavigate();
  const [activeMedia, setActiveMedia] = useState<MediaType>("gallery");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const googleMapEmbed = `https://www.google.com/maps?&q=${encodeURIComponent(
    address
  )}&z=15&output=embed`;

  return (
    <div className="pt-20 sm:pt-24 font-sans bg-[#F8F9F1]">
      <div className="w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 mx-auto">
        <div className="relative h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-xl overflow-hidden bg-black">
          {activeMedia === "gallery" && (
            <>
              <img
                src={images[currentImage]}
                alt={title}
                className="h-full w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage((p) =>
                        p === 0 ? images.length - 1 : p - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#D8F3DC]/90 px-2 py-1 rounded-full text-sm text-[#1B4332]"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage((p) => (p + 1) % images.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D8F3DC]/90 px-2 py-1 rounded-full text-sm text-[#1B4332]"
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
              allowFullScreen
            />
          )}

          {activeMedia === "video" && (
            <video
              src={videoUrl}
              controls
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <div className="flex gap-1 bg-[#D8F3DC]/90 p-1 rounded-full">
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
              <MediaButton
                label="Video"
                active={activeMedia === "video"}
                onClick={() => setActiveMedia("video")}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 bg-[#1B4332] text-white rounded-xl py-4">
          <div className="px-4 sm:px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 space-y-2">
              <h1 className="text-lg sm:text-xl font-semibold font-serif">
                {title}
              </h1>
              <p className="text-xs text-[#95D5B2]">{address}</p>
              <div>
                <p className="text-[11px] text-[#95D5B2]">Guide price</p>
                <p className="text-lg sm:text-xl font-bold">{priceRange}</p>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D8F3DC]">
                <span className="font-medium">Land size:</span>
                <span className="font-semibold">2.8 Acres</span>
              </div>
              <button
                onClick={() => navigate(`/property/${id}`)}
                className="mt-2 px-5 py-2 rounded-full bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition"
              >
                View full details
              </button>
            </div>

            <div className="bg-[#D8F3DC] text-[#1B4332] rounded-xl p-4 h-fit">
              <h3 className="text-xs font-semibold mb-2">
                Contact an agent
              </h3>
              <div className="flex gap-3 items-center">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{agent.name}</p>
                  <p className="text-xs text-[#6D4C41]">{agent.location}</p>
                  <p className="text-xs font-medium">{agent.phone}</p>
                </div>
              </div>
              <button className="mt-3 w-full px-4 py-2 rounded-full border border-[#2D6A4F] text-[#2D6A4F] text-xs font-semibold hover:bg-[#2D6A4F] hover:text-white transition">
                Request details
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F9F1] py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                About this property
              </h2>
              <div className="space-y-2 text-xs text-[#6D4C41] leading-relaxed">
                <p>
                  This impressive family residence was completed in 2016 and
                  offers exceptional lateral living arranged across four floors.
                </p>
                <p>
                  Designed with comfort and entertaining in mind, featuring air
                  conditioning and under-floor heating.
                </p>
                <p>
                  A bespoke German kitchen with integrated appliances and garden
                  access.
                </p>
                <p>
                  Glazed doors open to a private landscaped garden ideal for
                  entertaining.
                </p>
              </div>
            </div>

            <div className="bg-[#D8F3DC] rounded-xl p-4 space-y-2 h-fit">
              <h3 className="text-xs font-semibold text-[#1B4332]">
                Property highlights
              </h3>
              <ul className="space-y-1 text-xs text-[#6D4C41]">
                <li>• Four spacious floors</li>
                <li>• Under-floor heating</li>
                <li>• Bespoke German kitchen</li>
                <li>• Private garden</li>
                <li>• Air conditioning</li>
              </ul>
            </div>
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
        ? "bg-[#2D6A4F] text-white"
        : "bg-[#D8F3DC] text-[#1B4332]"
    }`}
  >
    {label}
  </button>
);
