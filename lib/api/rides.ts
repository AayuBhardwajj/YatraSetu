import { RideStatus, type Ride } from "@/types/ride";

export const ridesApi = {
  async getActiveRide(): Promise<Ride> {
    return {
      id: "RIDE-9012",
      userId: "USR-101",
      driverId: "DRV-222",
      type: "RIDE",
      pickup: "Koramangala 5th Block, Bengaluru",
      dropoff: "MG Road Metro, Bengaluru",
      distanceKm: 8.2,
      etaMinutes: 19,
      basePrice: 180,
      finalPrice: 190,
      status: RideStatus.ONGOING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};
