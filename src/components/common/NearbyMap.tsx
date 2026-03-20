import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { Icon as LeafletIcon, icon as leafletIcon } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PropertyMarker {
  _id: string;
  title: string;
  price: number;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  propertyType: string;
  images?: string[];
  onMarkerClick?: (propertyId: string) => void;
}

interface NearbyMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  properties: PropertyMarker[];
  radius: number; // in km
  onPropertyClick?: (propertyId: string) => void;
  zoom?: number;
}

// Custom hook to handle map pan
const MapController = ({ center, zoom }: { center: LatLngExpression; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Create custom icons
const createPropertyIcon = () =>
  leafletIcon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const createUserIcon = () =>
  leafletIcon({
    iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzQjgyRjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiMzQjgyRjYiLz48L3N2Zz4=",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

export const NearbyMap = ({
  userLocation,
  properties,
  radius,
  onPropertyClick,
  zoom = 13,
}: NearbyMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  if (!userLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Loading map...</p>
          <p className="text-sm text-gray-500">Please enable location access</p>
        </div>
      </div>
    );
  }

  const userLatLng: LatLngExpression = [userLocation.latitude, userLocation.longitude];
  const radiusInMeters = radius * 1000;

  return (
    <MapContainer
      center={userLatLng}
      zoom={zoom}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0.5rem",
        zIndex: 1,
      }}
      ref={mapRef}
    >
      <MapController center={userLatLng} zoom={zoom} />

      {/* Map Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      {/* User Location Circle */}
      <Circle
        center={userLatLng}
        radius={radiusInMeters}
        pathOptions={{
          color: "#3B82F6",
          fillColor: "#3B82F6",
          fillOpacity: 0.1,
          weight: 2,
          dashArray: "5, 5",
        }}
      />

      {/* User Location Marker */}
      <Marker position={userLatLng} icon={createUserIcon()}>
        <Popup>
          <div className="text-center">
            <p className="font-semibold text-blue-600">Your Location</p>
            <p className="text-sm text-gray-600">
              lat: {userLocation.latitude.toFixed(4)}
              <br />
              lng: {userLocation.longitude.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Property Markers */}
      {properties.map((property) => (
        <Marker
          key={property._id}
          position={[property.location.lat, property.location.lng]}
          icon={createPropertyIcon()}
          eventHandlers={{
            click: () => onPropertyClick?.(property._id),
          }}
        >
          <Popup>
            <div className="w-64 cursor-pointer" onClick={() => onPropertyClick?.(property._id)}>
              <div className="mb-2">
                {property.images && property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{property.title}</h3>
              <p className="text-lg font-bold text-blue-600 mb-1">
                ₹{property.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">{property.address}</p>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {property.propertyType}
                </span>
                <span className="text-blue-600 font-semibold">
                  {property.distance.toFixed(2)} km away
                </span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={() => onPropertyClick?.(property._id)}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
