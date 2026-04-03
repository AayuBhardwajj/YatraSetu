import type { Driver } from "@/types/user";

export const driversApi = {
  async listDrivers(): Promise<Driver[]> {
    return [
      {
        id: "DRV-101",
        name: "Rahul Verma",
        rating: 4.8,
        vehicle: "Maruti WagonR",
        plate: "KA 05 MQ 7192",
        status: "ONLINE",
        acceptanceRate: 92,
        totalTrips: 1780
      }
    ];
  }
};
