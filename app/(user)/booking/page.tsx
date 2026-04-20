"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Info, Bike, Car,
  LocateFixed, X, ArrowUpDown, Clock, Loader2, Search,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { MOCK_ML_PRICING } from "@/lib/mock/data";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RideStatus } from "@/types/ride";
import {
  useDestinationSearch,
  getRecentSearches,
  saveRecentSearch,
  type DestinationSuggestion,
} from "@/hooks/useDestinationSearch";

const UserMapWrapper = dynamic(() => import("@/components/user/UserMapWrapper"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center text-text-muted text-sm">Initializing map...</div>
});

/* ─── Constants ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "bike",  name: "Bike",  icon: Bike, price: 45,  time: "~8 min"  },
  { id: "auto",  name: "Auto",  icon: Car,  price: 89,  time: "~10 min" },
  { id: "mini",  name: "Mini",  icon: Car,  price: 130, time: "~12 min" },
  { id: "sedan", name: "Sedan", icon: Car,  price: 180, time: "~14 min" },
];

interface Driver { id: string; lat: number; lng: number; }

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState("mini");
  const [isLoaded,         setIsLoaded]         = useState(false);
  const [drivers,          setDrivers]           = useState<Driver[]>([]);
  const [loading,          setLoading]           = useState(false);

  // Destination search UI state
  const [query,       setQuery]       = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<
    { name: string; lat: number; lng: number }[]
  >([]);
  const inputRef     = useRef<HTMLInputElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { setRide, destinationName, destinationCoords, setDestinationName, setDestinationCoords } = useRideStore();
  const { initNegotiation } = useNegotiationStore();

  /* ── Nominatim live search ─────────────────────────────────────────────── */
  const { suggestions, isLoading, error } = useDestinationSearch(query, {
    userLat: undefined,
    userLng: undefined,
    limit: 5,
  });

  /* ── Init ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);



  /* ── Simulated drivers ─────────────────────────────────────────────────── */
  useEffect(() => {
    // Note: Since geolocation is managed by the MapWrapper, we use a fixed center for simulation
    const lat = 28.6139; 
    const lng = 77.2090;
    const base: Driver[] = [
      { id: "d1", lat: lat + 0.003, lng: lng + 0.002 },
      { id: "d2", lat: lat - 0.002, lng: lng + 0.004 },
      { id: "d3", lat: lat + 0.001, lng: lng - 0.003 },
    ];
    setDrivers(base);
    const interval = setInterval(() =>
      setDrivers(base.map((d) => ({
        ...d,
        lat: d.lat + (Math.random() - 0.5) * 0.0003,
        lng: d.lng + (Math.random() - 0.5) * 0.0003,
      }))), 3000
    );
    return () => clearInterval(interval);
  }, []);

  /* ── Click-outside dismissal ───────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current   && !inputRef.current.contains(e.target as Node)
      ) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Show dropdown when typing ─────────────────────────────────────────── */
  useEffect(() => {
    if (query.trim()) setShowDropdown(true);
  }, [query]);

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const handleSelect = (item: DestinationSuggestion) => {
    setDestinationName(item.primary);
    setDestinationCoords({ lat: item.lat, lng: item.lng });
    setQuery(item.primary);
    setShowDropdown(false);
    saveRecentSearch({ name: item.primary, lat: item.lat, lng: item.lng });
    setRecentSearches(getRecentSearches());
  };

  const handleSelectRecent = (r: { name: string; lat: number; lng: number }) => {
    setDestinationName(r.name);
    setDestinationCoords({ lat: r.lat, lng: r.lng });
    setQuery(r.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery("");
    setDestinationName("");
    setDestinationCoords(null);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleUseCurrentLocation = () => {
    setDestinationName("Current Location");
    setDestinationCoords(null); 
    setQuery("Current Location");
    setShowDropdown(false);
  };

  const handleBooking = async () => {
    if (!user) return
    setLoading(true)
    try {
      console.log("1. handleBooking called")

      const res = await fetch('/api/rides/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLabel: 'Current Location',
          dropLabel: destinationName || query || 'Unknown Destination',
          pickupLat: 30.9,
          pickupLng: 75.85,
          dropLat: destinationCoords?.lat ?? 30.92,
          dropLng: destinationCoords?.lng ?? 75.87,
          distanceKm: 3.0, // Default for now
          passengerId: user.id,
        }),
      })

      const json = await res.json()
      console.log("2. Booking API response:", res.status, json)

      if (!res.ok) {
        toast({ variant: 'destructive', title: 'Booking failed', description: json.error })
        return
      }

      initNegotiation(MOCK_ML_PRICING.suggestedPrice, MOCK_ML_PRICING.minPrice, MOCK_ML_PRICING.maxPrice);
      router.push(`/negotiate?rideId=${json.ride.id}`)
    } catch (err: any) {
      console.error("3. handleBooking error:", err)
      toast({ variant: 'destructive', title: 'Error', description: err.message })
    } finally {
      setLoading(false)
    }
  };

  /* ── Dropdown content ──────────────────────────────────────────────────── */
  const showRecents  = !query.trim() && recentSearches.length > 0;
  const showResults  = !!query.trim();
  const dropdownOpen = showDropdown && (showRecents || showResults);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* ── Left: Map ──────────────────────────────────────────────────────── */}
      <div className="flex-[3] h-full relative border-r border-border/50 min-w-0">
        <UserMapWrapper
          drivers={drivers}
          destination={destinationCoords ? [destinationCoords.lat, destinationCoords.lng] : null}
        />

        {/* Route pill badges */}
        <div className="absolute top-5 left-5 z-[1000] flex flex-col space-y-2">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-border/50 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-success rounded-full flex-shrink-0" />
            <span className="text-sm font-semibold truncate">Current Location</span>
          </div>
          {destinationName && (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-border/50 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-300">
              <div className="w-2.5 h-2.5 bg-danger rounded-full flex-shrink-0" />
              <span className="text-sm font-semibold truncate max-w-[180px]">{destinationName}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Booking Panel ───────────────────────────────────────────── */}
      <div className="flex-[2] h-full bg-white overflow-y-auto no-scrollbar min-w-[340px] max-w-[440px]">
        <div className="p-6 space-y-7">

          {/* ── Route Inputs ─────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Plan your trip</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary-light text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />Swap
              </Button>
            </div>

            <Card className="p-5 border-border/50 shadow-none space-y-3.5 relative">
              <div className="absolute left-[30px] top-[48px] bottom-[48px] w-0.5 border-l-2 border-dashed border-border" />

              {/* Pickup */}
              <div className="flex items-center space-x-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-success ring-4 ring-success/10 flex-shrink-0" />
                <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 h-11">
                  <span className="text-sm font-medium text-text-secondary truncate">Current Location</span>
                  <Button variant="ghost" size="icon" className="ml-auto text-primary h-8 w-8">
                    <LocateFixed className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-center space-x-3.5 relative">
                <div className="w-3.5 h-3.5 rounded-full bg-danger ring-4 ring-danger/10 flex-shrink-0" />
                <div className="relative flex-1">
                  <div
                    className={cn(
                      "flex items-center bg-white border rounded-xl px-4 h-11 transition-all duration-200",
                      dropdownOpen
                        ? "border-primary ring-2 ring-primary/15 rounded-b-none border-b-transparent"
                        : "border-primary/50 ring-2 ring-primary/10"
                    )}
                  >
                    <Search className="w-3.5 h-3.5 text-text-muted mr-2 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Enter destination"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className="bg-transparent border-none outline-none text-sm font-medium text-text-primary w-full h-full placeholder:text-text-muted"
                    />
                    {isLoading && (
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin flex-shrink-0 ml-1" />
                    )}
                    {query && !isLoading && (
                      <Button
                        variant="ghost" size="icon"
                        className="ml-auto text-text-muted hover:text-text-primary h-8 w-8 flex-shrink-0"
                        onClick={handleClear}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  {/* ── Dropdown ─────────────────────────────────────────── */}
                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 right-0 top-full z-[2000] bg-white border border-primary/50 border-t-0 rounded-b-xl shadow-xl overflow-hidden"
                      style={{ maxHeight: "288px", overflowY: "auto" }}
                    >
                      {/* Use current location */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light/60 transition-colors text-left border-b border-border/40 group"
                        onClick={handleUseCurrentLocation}
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                          <LocateFixed className="w-3.5 h-3.5 text-primary" />
                        </span>
                        <span className="text-sm font-semibold text-primary">Use current location</span>
                      </button>

                      {/* Recent searches (shown when input empty) */}
                      {showRecents && !query.trim() && (
                        <>
                          <div className="px-4 pt-2.5 pb-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Recent</p>
                          </div>
                          {recentSearches.map((r) => (
                            <button
                              key={r.name}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
                              onClick={() => handleSelectRecent(r)}
                            >
                              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                              </span>
                              <span className="text-sm font-medium text-text-primary truncate">{r.name}</span>
                            </button>
                          ))}
                        </>
                      )}

                      {/* Live results */}
                      {showResults && !isLoading && suggestions.length === 0 && !error && (
                        <div className="px-4 py-5 text-center">
                          <p className="text-sm text-text-muted">No results found for "<span className="font-semibold text-text-primary">{query}</span>"</p>
                        </div>
                      )}

                      {showResults && error && (
                        <div className="px-4 py-4 text-center">
                          <p className="text-sm text-danger">{error}</p>
                        </div>
                      )}

                      {showResults && suggestions.map((s, i) => (
                        <button
                          key={s.id}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light/50 transition-colors text-left group",
                            i < suggestions.length - 1 && "border-b border-border/30"
                          )}
                          onClick={() => handleSelect(s)}
                        >
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center group-hover:bg-danger/20 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-danger" />
                          </span>
                          <span className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{s.primary}</p>
                            {s.secondary && (
                              <p className="text-[11px] text-text-muted truncate mt-0.5">{s.secondary}</p>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </section>

          {/* ── Ride Categories ────────────────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">Choose your ride</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 rounded-2xl border transition-all space-y-2.5",
                      isSelected
                        ? "bg-primary-light border-2 border-primary/40 shadow-sm"
                        : "bg-white border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-full", isSelected ? "bg-primary text-white" : "bg-muted text-primary")}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-text-primary")}>{cat.name}</p>
                      <p className="text-lg font-bold text-text-primary font-tabular">₹{cat.price}</p>
                      <p className="text-[11px] text-text-muted">{cat.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── ML Price Card ─────────────────────────────────────────────── */}
          {isLoaded && (
            <section className="duration-200">
              <Card className="p-5 bg-primary-light border-l-4 border-l-primary border-y-0 border-r-0 rounded-none rounded-r-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-tight">AI Suggested Price</span>
                    <Info className="w-3.5 h-3.5 text-primary opacity-50" />
                  </div>
                  <div className="px-2 py-0.5 bg-success/15 text-success text-[10px] font-bold rounded uppercase">Fair price</div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-primary font-tabular tracking-tight">₹{MOCK_ML_PRICING.suggestedPrice}</span>
                  <span className="text-xs text-primary/50 font-medium">suggested fare</span>
                </div>
                <PriceRangeBar min={MOCK_ML_PRICING.minPrice} max={MOCK_ML_PRICING.maxPrice} suggested={MOCK_ML_PRICING.suggestedPrice} />
                <div className="flex flex-wrap gap-2">
                  {["Moderate demand", "3.2 km", "~12 min"].map((chip) => (
                    <div key={chip} className="px-2.5 py-1 bg-white/60 border border-primary/10 rounded-full text-[11px] font-semibold text-primary">{chip}</div>
                  ))}
                </div>
                <div className="flex flex-col space-y-2.5 pt-1">
                  <Button
                    onClick={handleBooking}
                    disabled={(!destinationName && !query) || loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Accept ₹${MOCK_ML_PRICING.suggestedPrice}`}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/negotiate")}
                    className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Negotiate Price
                  </Button>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}