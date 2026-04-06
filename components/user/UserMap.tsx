'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leaflet-fix';

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    const isFirst = useRef(true);
    useEffect(() => {
        if (isFirst.current) {
            map.setView(position);
            isFirst.current = false;
        }
    }, [position, map]);
    return null;
}

const userIcon = L.divIcon({
    className: '',
    html: `
    <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(99,102,241,0.25);animation:ping 1.5s ease-out infinite;top:-8px;left:-8px;"></div>
      <div style="width:18px;height:18px;background:#6366f1;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(99,102,241,0.5);position:relative;z-index:1;"></div>
    </div>
    <style>@keyframes ping{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}</style>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const driverIcon = L.divIcon({
    className: '',
    html: `
    <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(34,197,94,0.2);animation:dping 2s ease-out infinite;top:-4px;left:-4px;"></div>
      <div style="width:22px;height:22px;background:#16a34a;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(34,197,94,0.5);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
      </div>
    </div>
    <style>@keyframes dping{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}</style>
  `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

interface Driver {
    id: string;
    lat: number;
    lng: number;
}

interface UserMapProps {
    height?: string;
    className?: string;
    drivers?: Driver[];
}

export default function UserMap({ height = '100%', className, drivers = [] }: UserMapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
            (err) => setError(err.message),
            { enableHighAccuracy: true, timeout: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    if (error) return (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e] text-red-400 text-sm">
            📍 {error}
        </div>
    );

    if (!position) return (
        <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e] text-white text-sm">
            📡 Getting your location...
        </div>
    );

    return (
        <div style={{ height }} className={className}>
            <MapContainer
                center={position}
                zoom={15}
                zoomAnimation={false}
                fadeAnimation={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap position={position} />
                <Marker position={position} icon={userIcon}>
                    <Popup>📍 You are here</Popup>
                </Marker>
                {drivers.map((driver) => (
                    <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={driverIcon}>
                        <Popup>🚗 Driver nearby</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}