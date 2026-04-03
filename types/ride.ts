export enum RideStatus {
  REQUESTED = "REQUESTED",
  NEGOTIATING = "NEGOTIATING",
  CONFIRMED = "CONFIRMED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export type RideType = "RIDE" | "DELIVERY";

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  type: RideType;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  etaMinutes: number;
  basePrice: number;
  negotiatedPrice?: number;
  finalPrice?: number;
  status: RideStatus;
  createdAt: string;
  updatedAt: string;
}
