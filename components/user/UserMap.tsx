"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker, Polyline } from "leaflet";

/* ─── Leaflet Asset Fix ────────────────────────────────────────────────── */
// Prevents 404s for default marker icons in Next.js environment
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

export interface Driver {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface UserMapProps {
  position: [number, number];
  drivers?: Driver[];
  destination?: [number, number] | null;
}

export default function UserMap({
  position,
  drivers = [],
  destination = null,
}: UserMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Marker and layer refs to update without re-initializing the map
  const userMarkerRef = useRef<Marker | null>(null);
  const destMarkerRef = useRef<Marker | null>(null);
  const driverMarkersRef = useRef<Marker[]>([]);
  const polylineRef = useRef<Polyline | null>(null);

  /* ───────── 1. INITIALIZATION LIFECYCLE ───────── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 🔥 Fix: Strict Mode / HMR double initialization guard
    // We check if the container already has a Leaflet ID and purge it if so
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
      container.innerHTML = '';
    }

    // Ensure container has dimensions before initializing
    // If it's zero, Leaflet will fail to calculate projections
    if (container.offsetHeight === 0) {
      console.warn("UserMap: Container has 0 height. Check parent layout.");
    }

    const map = L.map(container, {
      center: position,
      zoom: 14,
      zoomControl: false, // Cleaner UI for ride app
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    // Precise timing: Wait for browser to finish layout before declaring ready
    requestAnimationFrame(() => {
      if (!map) return;
      map.invalidateSize();
      map.setView(position, 14);
      mapRef.current = map;
      setIsReady(true);
    });

    return () => {
      // ✅ Explicit cleanup ensures no memory leaks or zombie containers
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsReady(false);
    };
  }, []); // Only run once on mount

  /* ───────── 2. USER POSITION SYNC ───────── */
  useEffect(() => {
    // GUARD: Never call Leaflet methods before map is loaded
    const map = mapRef.current;
    if (!isReady || !map || !(map as any)._loaded) return;

    const latlng = L.latLng(position);

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(latlng)
        .addTo(map)
        .bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng(latlng);
    }

    // Smoothly pan to current position as it updates
    map.flyTo(latlng, map.getZoom() || 14, {
      animate: true,
      duration: 0.5,
    });
  }, [position, isReady]);

  /* ───────── 3. DESTINATION & ROUTE SYNC ───────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!isReady || !map || !(map as any)._loaded) return;

    if (destination) {
      const destLatLng = L.latLng(destination);

      // Destination Marker
      if (!destMarkerRef.current) {
        destMarkerRef.current = L.marker(destLatLng)
          .addTo(map)
          .bindPopup("Destination");
      } else {
        destMarkerRef.current.setLatLng(destLatLng);
      }

      // Route Polyline
      const points: [number, number][] = [position, destination];
      if (!polylineRef.current) {
        polylineRef.current = L.polyline(points, {
          color: "#6366f1", // Brand indigo
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10', // Dashed look
        }).addTo(map);
      } else {
        polylineRef.current.setLatLngs(points);
      }

      // Automatically fit bounds to show both markers
      const bounds = L.latLngBounds([position, destination]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });

    } else {
      // Cleanup destination layers if none
      destMarkerRef.current?.remove();
      destMarkerRef.current = null;
      polylineRef.current?.remove();
      polylineRef.current = null;
    }
  }, [destination, position, isReady]);

  /* ───────── 4. DYNAMIC DRIVERS SYNC ───────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!isReady || !map || !(map as any)._loaded) return;

    // Remove existing markers
    driverMarkersRef.current.forEach((m) => m.remove());

    // Add new markers
    driverMarkersRef.current = drivers.map((d) =>
      L.marker([d.lat, d.lng])
        .addTo(map)
        .bindPopup(d.name ?? "Available Driver")
    );
  }, [drivers, isReady]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
      }}
      className="bg-[#f0f0f0]"
    />
  );
}