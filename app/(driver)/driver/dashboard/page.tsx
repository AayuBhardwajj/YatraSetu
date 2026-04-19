"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  TrendingUp, Star, Clock, CheckCircle2,
  Zap, Timer, Navigation2, ToggleLeft, ToggleRight,
  IndianRupee, Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

// Dynamically import map to avoid SSR issues
const DriverMapWrapper = dynamic(
  () => import("@/components/driver/DriverMapWrapper"),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#0f1923] animate-pulse" /> }
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface RideRequest {
  id: string;
  passenger_id: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_label: string;
  drop_lat: number;
  drop_lng: number;
  drop_label: string;
  distance_km: number;
  suggested_price: number;
  status: string;
  expires_at: string | null;
}

// ─── Mock data (replace with real DB queries) ─────────────────────────────────
const RECENT_TRIPS = [
  { id: 1, destination: "Railway Station", time: "2:45 PM", earning: 160, status: "Completed" },
  { id: 2, destination: "Model Town", time: "1:20 PM", earning: 85, status: "Completed" },
  { id: 3, destination: "PGI Hospital", time: "11:05 AM", earning: 210, status: "Completed" },
];

const HOT_ZONES = [
  { id: 1, name: "Sector 17 Market", surge: "1.5x", distance: "0.8 km", color: "bg-orange-500" },
  { id: 2, name: "Elante Mall", surge: "1.2x", distance: "2.4 km", color: "bg-yellow-500" },
  { id: 3, name: "Chandigarh University", surge: "1.8x", distance: "5.2 km", color: "bg-red-500" },
];

const REQUEST_TIMEOUT = 20;

// ─── Component ────────────────────────────────────────────────────────────────
export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [timeLeft, setTimeLeft] = useState(REQUEST_TIMEOUT);
  const [accepting, setAccepting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const { user, driverProfile } = useAuthStore();

  // ── Realtime subscription ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOnline) return;

    const channel = supabase
      .channel("driver-ride-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ride_requests", filter: "status=eq.open" },
        (payload) => {
          const request = payload.new as RideRequest;
          setCurrentRequest(request);
          setTimeLeft(REQUEST_TIMEOUT);
          setShowRequest(true);
        }
      )
      .subscribe((status) => {
        console.log("Driver realtime:", status);
      });

    return () => { supabase.removeChannel(channel); };
  }, [isOnline]);

  // ── Countdown ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showRequest) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    timerRef.current = setTimeout(() => {
      setShowRequest(false);
      setCurrentRequest(null);
    }, REQUEST_TIMEOUT * 1000);

    countdownRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(countdownRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showRequest]);

  // ── Accept ───────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!currentRequest || !user) return;
    setAccepting(true);
    const { error } = await supabase
      .from("ride_requests")
      .update({ accepted_driver_id: user.id, status: "accepted" })
      .eq("id", currentRequest.id)
      .eq("status", "open");

    if (error) { console.error("Accept error:", error); setAccepting(false); return; }
    setShowRequest(false);
    router.push(`/driver/active-ride?rideId=${currentRequest.id}`);
  };

  const handleDecline = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowRequest(false);
    setCurrentRequest(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0f1923]">

      {/* ── LEFT: Dark Map Panel (65%) ── */}
      <div className="w-[65%] h-full relative">

        {/* Real map fills entire panel */}
        <div className="absolute inset-0">
          <DriverMapWrapper
            showHotZones={true}
            isOnline={isOnline}
            incomingRequest={currentRequest}
          />
        </div>

        {/* Top bar: online toggle + status */}
        <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 bg-[#0f1923]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <div className={cn("w-2.5 h-2.5 rounded-full", isOnline ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
            <span className="text-sm font-bold text-white">
              {isOnline ? "Online · Accepting Rides" : "Offline"}
            </span>
          </div>
          <button
            onClick={() => setIsOnline(v => !v)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2.5 rounded-2xl border font-bold text-sm transition-all",
              isOnline
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
            )}
          >
            {isOnline ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{isOnline ? "Go Offline" : "Go Online"}</span>
          </button>
        </div>

        {/* Bottom stats strip */}
        <div className="absolute bottom-5 left-5 right-5 z-10 grid grid-cols-3 gap-3">
          {[
            { label: "Today's Earnings", value: "₹1,420", icon: IndianRupee, accent: "text-emerald-400" },
            { label: "Trips Done", value: "12", icon: CheckCircle2, accent: "text-blue-400" },
            { label: "Rating", value: "4.8★", icon: Star, accent: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0f1923]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center space-x-3">
              <stat.icon className={cn("w-5 h-5 flex-shrink-0", stat.accent)} />
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-lg font-bold", stat.accent)}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Incoming Ride Request Popup ── */}
        {showRequest && currentRequest && (
          <div className="absolute inset-x-5 bottom-28 z-20 animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div className="bg-[#0f1923] border-2 border-emerald-500/60 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
              <div className="p-5 space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                      <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base">New Ride Request</p>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        {currentRequest.distance_km} km away
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">₹{currentRequest.suggested_price}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Est. fare</p>
                  </div>
                </div>

                {/* Route */}
                <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full flex-shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">{currentRequest.pickup_label}</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-700 ml-1" />
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full flex-shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">{currentRequest.drop_label}</span>
                  </div>
                </div>

                {/* Timer row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      Expires in {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(timeLeft / REQUEST_TIMEOUT) * 100}%`, transition: "width 1s linear" }}
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-1">
                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-60"
                  >
                    {accepting ? "Accepting..." : "Accept Ride"}
                  </button>
                  <button
                    onClick={handleDecline}
                    className="w-24 h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 rounded-2xl font-bold text-sm transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Dark Operations Panel (35%) ── */}
      <aside className="w-[35%] h-full bg-[#141c26] border-l border-white/5 overflow-y-auto no-scrollbar">
        <div className="p-6 space-y-8">

          {/* Driver greeting */}
          <div className="space-y-1">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Welcome back</p>
            <h2 className="text-white text-xl font-bold">
              {(driverProfile as any)?.full_name?.split(" ")[0] ?? "Driver"} 👋
            </h2>
          </div>

          {/* Realtime indicator */}
          <div className={cn(
            "flex items-center space-x-2.5 px-4 py-3 rounded-2xl border",
            isOnline
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-zinc-800 border-zinc-700"
          )}>
            <Activity className={cn("w-4 h-4", isOnline ? "text-emerald-400" : "text-zinc-600")} />
            <span className={cn("text-xs font-bold uppercase tracking-widest", isOnline ? "text-emerald-400" : "text-zinc-600")}>
              {isOnline ? "Listening for ride requests" : "Go online to receive rides"}
            </span>
          </div>

          {/* Hot Zones */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hot Zones</h3>
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
            <div className="space-y-3">
              {HOT_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", zone.color)} />
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{zone.name}</p>
                      <p className="text-[11px] text-zinc-600">{zone.distance} away</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                    {zone.surge}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Trips */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Trips</h3>
              <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">See All</button>
            </div>
            <div className="space-y-3">
              {RECENT_TRIPS.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">To {trip.destination}</p>
                      <p className="text-[11px] text-zinc-600">{trip.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">+₹{trip.earning}</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase">{trip.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}