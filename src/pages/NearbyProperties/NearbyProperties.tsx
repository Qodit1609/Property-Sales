import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, List, Map, RotateCw, AlertCircle, Navigation } from "lucide-react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { NearbyMap } from "../../components/common/NearbyMap";
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
  createdAt: string;
  sellerId: {
    name: string;
    email: string;
  };
}

const NearbyProperties = () => {
  const navigate = useNavigate();
  const { location, loading, error, requestLocation, isSupported } = useGeolocation();
  const [properties, setProperties] = useState<NearbyProperty[]>([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [radius, setRadius] = useState(5);
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch nearby properties when location changes
  useEffect(() => {
    if (location) {
      fetchNearbyProperties();
    }
  }, [location, radius, filters]);

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

      if (filters.propertyType) {
        params.append("propertyType", filters.propertyType);
      }
      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }

      const response = await axios.get(`/api/properties/nearby?${params}`);
      setProperties(response.data.data.properties);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to fetch nearby properties"
        : "Failed to fetch nearby properties";
      setError2(errorMessage);
      console.error("Error fetching nearby properties:", err);
    } finally {
      setLoading2(false);
    }
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleRefresh = () => {
    if (location) {
      fetchNearbyProperties();
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Geolocation Not Supported
            </h2>
            <p className="text-red-700">
              Your browser does not support the Geolocation API. Please use a modern browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Nearby Properties</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  viewMode === "map"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Location Status */}
          {loading && !location && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="animate-spin">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-blue-700">Getting your location...</p>
            </div>
          )}

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}

          {location && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <p className="text-green-700">
                <span className="font-semibold">Location Found:</span> {location.latitude.toFixed(4)},
                {location.longitude.toFixed(4)} (Accuracy: {Math.round(location.accuracy)}m)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!location ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enable Location</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to share your location and find nearby properties.
            </p>
            <button
              onClick={requestLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 mx-auto"
            >
              <Navigation className="w-5 h-5" />
              {loading ? "Getting Location..." : "Share My Location"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

                {/* Radius Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Radius: <span className="text-blue-600">{radius} km</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Farmland">Farmland</option>
                    <option value="Agriculture Land">Agriculture Land</option>
                    <option value="Plot">Plot</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={loading2}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  {loading2 ? "Searching..." : "Apply Filters"}
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {loading2 && !properties.length && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="animate-spin mb-4">
                    <RotateCw className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                  <p className="text-gray-600">Finding nearby properties...</p>
                </div>
              )}

              {error2 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700 font-semibold">Error: {error2}</p>
                </div>
              )}

              {!loading2 && properties.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No properties found within {radius} km of your location.
                  </p>
                </div>
              )}

              {/* Map View */}
              {viewMode === "map" && location && properties.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-96 lg:h-full">
                  <NearbyMap
                    userLocation={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    properties={properties}
                    radius={radius}
                    onPropertyClick={handlePropertyClick}
                  />
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && properties.length > 0 && (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden flex"
                      onClick={() => handlePropertyClick(property._id)}
                    >
                      {/* Image */}
                      <div className="w-40 h-40 flex-shrink-0 bg-gray-200">
                        {property.images && property.images[0] && (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {property.shortDescription}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.address}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {property.bedrooms && (
                            <span className="text-gray-600">
                              {property.bedrooms} Bedrooms
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="text-gray-600">
                              {property.bathrooms} Bathrooms
                            </span>
                          )}
                          {property.area && (
                            <span className="text-gray-600">
                              {property.area} {property.areaUnit}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="w-40 p-4 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-blue-100 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{(property.price / 100000).toFixed(1)}L
                          </p>
                          <p className="text-xs text-gray-600">
                            {property.propertyType}
                          </p>
                        </div>
                        <div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                            {property.distance.toFixed(2)} km away
                          </div>
                          <p className="text-xs text-gray-600">
                            {Math.round((1 / property.distance) * 100)}% closer
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State for Map View */}
              {viewMode === "map" && location && properties.length > 0 && (
                <div className="hidden">
                  <NearbyMap
                    userLocation={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                    properties={properties}
                    radius={radius}
                    onPropertyClick={handlePropertyClick}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {properties.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-semibold">
              Found {properties.length} properties within {radius} km of your location
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyProperties;
