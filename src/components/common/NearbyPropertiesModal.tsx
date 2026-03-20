import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, MapPin, Navigation, RotateCw, AlertCircle, Home, MapIcon } from "lucide-react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useCloudinaryImage } from "../../hooks/useCloudinaryImage";
import { NearbyMap } from "./NearbyMap";
import { OptimizedImage } from "./OptimizedImage";
import axios from "axios";

export interface NearbyProperty {
  _id: string;
  title: string;
  propertyType: string;
  price: number;
  address: string;
  city: string;
  location: {
    coordinates: number[];
    lat: number;
    lng: number;
  };
  distance: number;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  shortDescription: string;
  dealer?: {
    name: string;
    phone: string;
    type: string;
  };
}

interface NearbyPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Skeleton component for loading state
const PropertyListSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex gap-3 p-4 border border-gray-200 rounded-lg animate-pulse">
        <div className="w-24 h-24 flex-shrink-0 bg-gray-300 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-3" />
          <div className="flex gap-2">
            <div className="h-3 bg-gray-300 rounded w-20" />
            <div className="h-3 bg-gray-300 rounded w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Property list card subcomponent
interface PropertyListCardProps {
  property: NearbyProperty;
  onSelect: () => void;
}

const PropertyListCard = ({ property, onSelect }: PropertyListCardProps) => {
  const { getImageUrl } = useCloudinaryImage(property.images?.[0], 'small');

  return (
    <div
      onClick={onSelect}
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer transition-all duration-200 group"
    >
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <OptimizedImage
          src={property.images?.[0]}
          preset="small"
          lazy={true}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          containerClass="w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-2">
          {property.address}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-blue-600">
            ₹{(property.price / 100000).toFixed(1)}L
          </span>
          <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-50 px-2 py-1 rounded text-blue-700 font-semibold">
            {property.distance.toFixed(1)} km away
          </span>
          {property.propertyType && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              {property.propertyType}
            </span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="flex items-center justify-center">
        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
          →
        </div>
      </div>
    </div>
  );
};

export const NearbyPropertiesModal = ({
  isOpen,
  onClose,
}: NearbyPropertiesModalProps) => {
  const navigate = useNavigate();
  const { location, loading, error, requestLocation, isSupported } =
    useGeolocation();
  const [properties, setProperties] = useState<NearbyProperty[]>([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState<string | null>(null);
  const [radius, setRadius] = useState(5);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (location) {
      fetchNearbyProperties();
    }
  }, [location, radius]);

  const fetchNearbyProperties = async () => {
    if (!location) return;

    try {
      setLoading2(true);
      setError2(null);

      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        radius: String(radius),
        limit: "50",
      });

      const response = await axios.get(`/api/properties/nearby?${params}`);
      setProperties(response.data.data.properties || []);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to fetch nearby properties. Please try again."
        : "An error occurred while fetching properties.";
      setError2(errorMessage);
    } finally {
      setLoading2(false);
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
    onClose();
  };

  const handleRetry = () => {
    fetchNearbyProperties();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-0">
      <div className="w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-t-2xl md:rounded-xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-center-0 duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Find Nearby Properties
              </h2>
              <p className="text-xs text-gray-500">Discover properties around your location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-5">
            {!isSupported ? (
              // Not Supported State
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-xl p-6 text-center">
                <div className="inline-block p-3 bg-red-200 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Geolocation Not Supported
                </h3>
                <p className="text-red-700 text-sm">
                  Your browser does not support the Geolocation API. Please try using Chrome, Firefox, Safari,
                  or Edge.
                </p>
              </div>
            ) : !location ? (
              // Location Request State
              <div className="text-center py-12 sm:py-16">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-6 animate-bounce">
                  <MapPin className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Share Your Location
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-8 max-w-xs mx-auto">
                  Enable location access to discover properties near you
                </p>
                <button
                  onClick={requestLocation}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Share My Location
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* Error Messages */}
                {error && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 text-sm">{error}</p>
                  </div>
                )}

                {error2 && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3 justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-900 font-semibold text-sm">Error Loading Properties</p>
                        <p className="text-red-700 text-xs mt-1">{error2}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="ml-2 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors flex-shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Controls Section */}
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  {/* Radius Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Search Radius
                      </label>
                      <span className="text-lg font-bold text-blue-600">
                        {radius} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-2 bg-white rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("map")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                        viewMode === "map"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <MapIcon size={16} />
                      <span className="hidden sm:inline">Map</span>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Home size={16} />
                      <span className="hidden sm:inline">List</span>
                    </button>
                  </div>
                </div>

                {/* Results Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm">
                    <span className="font-bold text-lg text-blue-600">{properties.length}</span>
                    {" "} {properties.length === 1 ? "property" : "properties"} found within{" "}
                    <span className="font-bold">{radius} km</span>
                  </p>
                </div>

                {/* Map View */}
                {viewMode === "map" && (
                  <div className="h-80 sm:h-96 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    {loading2 ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <RotateCw className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">Loading map...</p>
                        </div>
                      </div>
                    ) : properties.length > 0 ? (
                      <NearbyMap
                        userLocation={{
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }}
                        properties={properties}
                        radius={radius}
                        onPropertyClick={handlePropertySelect}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium">No properties found</p>
                          <p className="text-gray-500 text-xs mt-1">Try increasing the search radius</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-3">
                    {loading2 ? (
                      <PropertyListSkeleton />
                    ) : properties.length > 0 ? (
                      properties.map((property) => (
                        <PropertyListCard
                          key={property._id}
                          property={property}
                          onSelect={() => handlePropertySelect(property._id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No properties found</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search radius or location</p>
                        <button
                          onClick={handleRetry}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Refresh
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
