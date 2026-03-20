import { useState, useEffect, useCallback, useRef } from "react";

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface UseGeolocationReturn {
  location: GeolocationCoordinates | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
  isSupported: boolean;
}

/**
 * Hook for getting user's geolocation using Browser Geolocation API
 * Supports real-time position tracking for nearby features
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const isSupported = useCallback(() => {
    return "geolocation" in navigator;
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    const errorMessages: { [key: number]: string } = {
      1: "Permission denied. Please enable location access in your browser settings.",
      2: "Position unavailable. Please check your GPS and try again.",
      3: "Request timeout. Try again later.",
    };

    const errorMsg = errorMessages[err.code] || "Unable to get your location";
    setError(errorMsg);
    setLoading(false);
    console.error("Geolocation error:", err);
  }, []);

  const requestLocation = useCallback(() => {
    if (!isSupported()) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [isSupported, handleSuccess, handleError]);

  const startWatching = useCallback(() => {
    if (!isSupported()) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
  }, [isSupported, handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    stopWatching();
  }, [stopWatching]);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    location,
    loading,
    error,
    requestLocation,
    clearLocation,
    isSupported: isSupported(),
  };
};
