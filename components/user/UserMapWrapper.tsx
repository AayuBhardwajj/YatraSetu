"use client";

import {
    useEffect, useRef, useState, useCallback, memo, useMemo
} from "react";
import dynamic from "next/dynamic";
import type { Driver } from "./UserMap";

const UserMap = dynamic(() => import("./UserMap"), {
    ssr: false,
    loading: () => <MapPlaceholder message="Loading map…" />,
});

const MemoizedUserMap = memo(UserMap);

interface UserMapWrapperProps {
    drivers?: Driver[];
    destination?: [number, number] | null;
}

export default function UserMapWrapper({
    drivers = [],
    destination = null,
}: UserMapWrapperProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const handlePosition = useCallback((pos: GeolocationPosition) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
    }, []);

    const handleError = useCallback((err: GeolocationPositionError) => {
        console.error("Geolocation error:", err.message);
        // Only show error if we haven't acquired position yet
        if (!position) {
            setGeoError("Unable to get your location. Please check GPS settings.");
        }
    }, [position]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation is not supported by your browser.");
            return;
        }

        // Initial acquisition
        navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
            enableHighAccuracy: true,
            timeout: 10_000,
        });

        // Continuous watch
        watchIdRef.current = navigator.geolocation.watchPosition(
            handlePosition,
            handleError,
            { enableHighAccuracy: true, maximumAge: 5_000, timeout: 15_000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, []); // Empty deps to run once on mount

    // Stable drivers reference — prevents unnecessary map re-renders
    const stableDrivers = useMemo(() => drivers, [JSON.stringify(drivers)]); // eslint-disable-line

    if (geoError && !position) {
        return <MapPlaceholder message={geoError} error />;
    }

    // ✅ THE CRITICAL GATE: Never render UserMap until position is a valid tuple.
    if (!position) {
        return <MapPlaceholder message="Acquiring your location..." />;
    }

    return (
        <div style={{ height: "100%", width: "100%", position: 'relative' }}>
            <MemoizedUserMap
                position={position}
                drivers={stableDrivers}
                destination={destination}
            />
        </div>
    );
}

// ─── Shared placeholder ────────────────────────────────────────────────────
function MapPlaceholder({
    message,
    error = false,
}: {
    message: string;
    error?: boolean;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "400px",
                background: error ? "#fef2f2" : "#f3f4f6",
                border: error ? "1px solid #fecaca" : "none",
                borderRadius: "0.5rem",
            }}
        >
            <p style={{ color: error ? "#ef4444" : "#6b7280", fontSize: "0.875rem" }}>
                {message}
            </p>
        </div>
    );
}