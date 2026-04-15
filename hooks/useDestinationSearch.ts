import { useState, useEffect, useRef, useCallback } from "react";

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

const RECENT_KEY = "ride_recent_destinations";
const MAX_RECENT = 5;

function getSecondaryLabel(r: NominatimResult): string {
  const a = r.address;
  const parts: string[] = [];
  if (a.suburb) parts.push(a.suburb);
  const city = a.city || a.town;
  if (city) parts.push(city);
  if (a.state) parts.push(a.state);
  if (a.country) parts.push(a.country);
  return parts.slice(0, 3).join(", ");
}

function getPrimaryLabel(r: NominatimResult): string {
  const a = r.address;
  return a.road || a.suburb || r.display_name.split(",")[0];
}

export function getRecentSearches(): { name: string; lat: number; lng: number }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecentSearch(item: { name: string; lat: number; lng: number }) {
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((e) => e.name !== item.name);
    const updated = [item, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

export interface DestinationSuggestion {
  id: number;
  primary: string;
  secondary: string;
  displayName: string;
  lat: number;
  lng: number;
}

interface UseDestinationSearchOptions {
  debounceMs?: number;
  limit?: number;
  userLat?: number | null;
  userLng?: number | null;
}

export function useDestinationSearch(
  query: string,
  { debounceMs = 350, limit = 5, userLat, userLng }: UseDestinationSearchOptions = {}
) {
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (q: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!q.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      timerRef.current = setTimeout(async () => {
        // Cancel in-flight request
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const params = new URLSearchParams({
            q,
            format: "json",
            addressdetails: "1",
            limit: String(limit),
          });

          // Bias results toward user location if available
          if (userLat != null && userLng != null) {
            // ~50km viewbox bias
            const delta = 0.5;
            params.set(
              "viewbox",
              `${userLng - delta},${userLat + delta},${userLng + delta},${userLat - delta}`
            );
            params.set("bounded", "0"); // soft bias, not hard restriction
          }

          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
              signal: controller.signal,
              headers: {
                "User-Agent": "YatraSetu-ride-app (contact@yatrasetu.app)",
                "Accept-Language": "en",
              },
            }
          );

          if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

          const data: NominatimResult[] = await res.json();
          setSuggestions(
            data.map((r) => ({
              id: r.place_id,
              primary: getPrimaryLabel(r),
              secondary: getSecondaryLabel(r),
              displayName: r.display_name,
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
            }))
          );
        } catch (err: unknown) {
          if (err instanceof Error && err.name === "AbortError") return; // cancelled – ignore
          setError("Could not fetch suggestions. Check your connection.");
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, limit, userLat, userLng]
  );

  useEffect(() => {
    search(query);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, search]);

  return { suggestions, isLoading, error };
}
