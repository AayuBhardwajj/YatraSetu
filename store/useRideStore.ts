import { create } from "zustand";
import type { Ride } from "@/types/ride";

interface RideStore {
  currentRide: Ride | null;
  status: "idle" | "requesting" | "accepted" | "ongoing" | "completed" | "cancelled";
  driverInfo: any | null;
  destinationName: string;
  destinationCoords: { lat: number, lng: number } | null;
  setRide: (ride: Ride) => void;
  updateStatus: (status: RideStore["status"]) => void;
  setDriver: (driver: any) => void;
  setDestinationName: (name: string) => void;
  setDestinationCoords: (coords: { lat: number, lng: number } | null) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideStore>((set) => ({
  currentRide: null,
  status: "idle",
  driverInfo: null,
  destinationName: "",
  destinationCoords: null,
  setRide: (ride) => set({ currentRide: ride }),
  updateStatus: (status) => set({ status }),
  setDriver: (driver) => set({ driverInfo: driver }),
  setDestinationName: (name) => set({ destinationName: name }),
  setDestinationCoords: (coords) => set({ destinationCoords: coords }),
  clearRide: () => set({ currentRide: null, status: "idle", driverInfo: null, destinationName: "", destinationCoords: null }),
}));
