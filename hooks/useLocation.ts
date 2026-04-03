"use client";

import { useEffect, useState } from "react";

type LocationState = {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
};

export const useLocation = (active = true): LocationState => {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    if (!active || !navigator.geolocation) return;

    const update = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
            loading: false
          });
        },
        (error) => {
          setState((prev) => ({ ...prev, error: error.message, loading: false }));
        }
      );
    };

    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [active]);

  return state;
};
