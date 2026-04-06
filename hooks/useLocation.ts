import { useState, useCallback, useRef } from "react";

export interface LocationSuggestion {
  id: string;
  displayName: string;      // short label e.g. "Sector 17, Chandigarh"
  fullAddress: string;      // full address string
  lat: number;
  lon: number;
}

interface UseLocationSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  suggestions: LocationSuggestion[];
  isLoading: boolean;
  selected: LocationSuggestion | null;
  selectSuggestion: (s: LocationSuggestion) => void;
  clear: () => void;
}

export function useLocationSearch(debounceMs = 300): UseLocationSearchReturn {
  const [query, setQueryRaw] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<LocationSuggestion | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Cancel previous in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q,
        format: "json",
        addressdetails: "1",
        limit: "6",
        countrycodes: "in",        // bias to India; remove for global
      });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          signal: abortRef.current.signal,
          headers: { "Accept-Language": "en" },
        }
      );
      const data = await res.json();

      const mapped: LocationSuggestion[] = (data as any[]).map((item) => {
        // Build a short readable display name from address parts
        const a = item.address ?? {};
        const parts = [
          a.road ?? a.pedestrian ?? a.neighbourhood,
          a.suburb ?? a.city_district,
          a.city ?? a.town ?? a.village,
          a.state,
        ].filter(Boolean);

        return {
          id: item.place_id,
          displayName: parts.slice(0, 2).join(", ") || item.display_name.split(",")[0],
          fullAddress: parts.join(", ") || item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        };
      });

      setSuggestions(mapped);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setQuery = useCallback(
    (q: string) => {
      setQueryRaw(q);
      setSelected(null);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (q.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      timerRef.current = setTimeout(() => fetchSuggestions(q), debounceMs);
    },
    [fetchSuggestions, debounceMs]
  );

  const selectSuggestion = useCallback((s: LocationSuggestion) => {
    setSelected(s);
    setQueryRaw(s.displayName);
    setSuggestions([]);
  }, []);

  const clear = useCallback(() => {
    setQueryRaw("");
    setSuggestions([]);
    setSelected(null);
    setIsLoading(false);
    abortRef.current?.abort();
  }, []);

  return { query, setQuery, suggestions, isLoading, selected, selectSuggestion, clear };
}
