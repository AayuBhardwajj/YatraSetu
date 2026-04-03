export type NegotiationStatus = "PENDING" | "COUNTERED" | "ACCEPTED" | "REJECTED";

export interface NegotiationPayload {
  rideId: string;
  userOffer: number;
  driverOffer?: number;
  status: NegotiationStatus;
}
