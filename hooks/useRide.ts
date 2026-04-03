"use client";

import { ridesApi } from "@/lib/api/rides";
import { useRideStore } from "@/store/useRideStore";

export const useRide = () => {
  const { currentRide, setRide, clearRide } = useRideStore();

  const loadRide = async () => {
    const ride = await ridesApi.getActiveRide();
    setRide(ride);
  };

  return { currentRide, loadRide, clearRide };
};
