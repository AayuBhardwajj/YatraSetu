import { create } from "zustand";
import type { Ride } from "@/types/ride";

interface RideStore {
  currentRide: Ride | null;
  status: "idle" | "requesting" | "accepted" | "ongoing" | "completed" | "cancelled";
  driverInfo: any | null;
  setRide: (ride: Ride) => void;
  updateStatus: (status: RideStore["status"]) => void;
  setDriver: (driver: any) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideStore>((set) => ({
  currentRide: null,
  status: "idle",
  driverInfo: null,
  setRide: (ride) => set({ currentRide: ride }),
  updateStatus: (status) => set({ status }),
  setDriver: (driver) => set({ driverInfo: driver }),
  clearRide: () => set({ currentRide: null, status: "idle", driverInfo: null }),
}));
