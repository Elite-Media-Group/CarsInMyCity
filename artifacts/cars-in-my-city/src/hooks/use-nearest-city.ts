import { useState, useCallback } from "react";
import { CITY_COORDS } from "@/data/city-coords";

export type NearMeStatus = "idle" | "locating" | "found" | "error";

export interface NearestCity {
  stateSlug: string;
  citySlug: string;
  distanceMiles: number;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearest(lat: number, lon: number): NearestCity {
  let best: NearestCity = { stateSlug: "", citySlug: "", distanceMiles: Infinity };
  for (const [key, [clat, clon]] of Object.entries(CITY_COORDS)) {
    const d = haversineMiles(lat, lon, clat, clon);
    if (d < best.distanceMiles) {
      const slash = key.indexOf("/");
      best = { stateSlug: key.slice(0, slash), citySlug: key.slice(slash + 1), distanceMiles: d };
    }
  }
  return best;
}

export function useNearestCity() {
  const [status, setStatus] = useState<NearMeStatus>("idle");
  const [nearest, setNearest] = useState<NearestCity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Your browser doesn't support location services.");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const result = findNearest(pos.coords.latitude, pos.coords.longitude);
        setNearest(result);
        setStatus("found");
      },
      (err) => {
        setStatus("error");
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access was denied. Please allow location access and try again.");
        } else if (err.code === err.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to determine your location. Please browse by state instead.");
        }
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setNearest(null);
    setError(null);
  }, []);

  return { status, nearest, error, locate, reset };
}
