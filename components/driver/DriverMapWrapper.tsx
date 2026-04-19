"use client";
import React, { useEffect, useRef } from "react";

interface RideRequest {
    pickup_lat: number;
    pickup_lng: number;
    drop_lat: number;
    drop_lng: number;
    pickup_label: string;
    drop_label: string;
}

interface DriverMapWrapperProps {
    showHotZones?: boolean;
    isOnline?: boolean;
    incomingRequest?: RideRequest | null;
}

export default function DriverMapWrapper({
    isOnline = true,
    incomingRequest = null,
}: DriverMapWrapperProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const pickupMarkerRef = useRef<any>(null);
    const dropMarkerRef = useRef<any>(null);
    const routeLineRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        import("leaflet").then((L) => {
            if (!mapContainerRef.current) return;
            // Guard against React Strict Mode double-invoke
            if ((mapContainerRef.current as any)._leaflet_id) return;

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapContainerRef.current, {
                center: [30.9, 75.85],
                zoom: 13,
                zoomControl: false,
            });

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                { attribution: "© OpenStreetMap contributors © CARTO", subdomains: "abcd", maxZoom: 19 }
            ).addTo(map);

            L.control.zoom({ position: "bottomright" }).addTo(map);

            const driverIcon = L.divIcon({
                className: "",
                html: `
          <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;inset:0;background:#10b981;border-radius:50%;opacity:0.25;animation:driverPing 1.8s ease-out infinite;"></div>
            <div style="width:14px;height:14px;background:#10b981;border-radius:50%;border:2.5px solid white;box-shadow:0 0 10px #10b981;position:relative;z-index:1;"></div>
          </div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            mapInstanceRef.current = map;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        if (!mapInstanceRef.current) return;
                        map.setView([coords.latitude, coords.longitude], 14);
                        L.marker([coords.latitude, coords.longitude], { icon: driverIcon })
                            .addTo(map).bindPopup("Your location");
                    },
                    () => {
                        if (!mapInstanceRef.current) return;
                        L.marker([30.9, 75.85], { icon: driverIcon }).addTo(map);
                    }
                );
            } else {
                L.marker([30.9, 75.85], { icon: driverIcon }).addTo(map);
            }
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            if (mapContainerRef.current) {
                delete (mapContainerRef.current as any)._leaflet_id;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        import("leaflet").then((L) => {
            if (pickupMarkerRef.current) { mapInstanceRef.current.removeLayer(pickupMarkerRef.current); pickupMarkerRef.current = null; }
            if (dropMarkerRef.current) { mapInstanceRef.current.removeLayer(dropMarkerRef.current); dropMarkerRef.current = null; }
            if (routeLineRef.current) { mapInstanceRef.current.removeLayer(routeLineRef.current); routeLineRef.current = null; }

            if (!incomingRequest) return;

            const pickupIcon = L.divIcon({
                className: "",
                html: `<div style="width:16px;height:16px;background:#10b981;border-radius:50%;border:2.5px solid white;box-shadow:0 0 8px #10b981;"></div>`,
                iconSize: [16, 16], iconAnchor: [8, 8],
            });

            const dropIcon = L.divIcon({
                className: "",
                html: `<div style="width:16px;height:16px;background:#f87171;border-radius:50%;border:2.5px solid white;box-shadow:0 0 8px #f87171;"></div>`,
                iconSize: [16, 16], iconAnchor: [8, 8],
            });

            pickupMarkerRef.current = L.marker(
                [incomingRequest.pickup_lat, incomingRequest.pickup_lng], { icon: pickupIcon }
            ).addTo(mapInstanceRef.current).bindPopup(`<b>Pickup</b><br/>${incomingRequest.pickup_label}`);

            dropMarkerRef.current = L.marker(
                [incomingRequest.drop_lat, incomingRequest.drop_lng], { icon: dropIcon }
            ).addTo(mapInstanceRef.current).bindPopup(`<b>Drop</b><br/>${incomingRequest.drop_label}`);

            routeLineRef.current = L.polyline(
                [[incomingRequest.pickup_lat, incomingRequest.pickup_lng], [incomingRequest.drop_lat, incomingRequest.drop_lng]],
                { color: "#10b981", weight: 2, dashArray: "6 6", opacity: 0.7 }
            ).addTo(mapInstanceRef.current);

            mapInstanceRef.current.fitBounds(
                L.latLngBounds(
                    [incomingRequest.pickup_lat, incomingRequest.pickup_lng],
                    [incomingRequest.drop_lat, incomingRequest.drop_lng]
                ),
                { padding: [80, 80] }
            );
        });
    }, [incomingRequest]);

    return (
        <>
            <style>{`
        @keyframes driverPing {
          0% { transform: scale(1); opacity: 0.4; }
          70% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .leaflet-container { background: #0f1923 !important; }
      `}</style>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%", background: "#0f1923" }} />
        </>
    );
}