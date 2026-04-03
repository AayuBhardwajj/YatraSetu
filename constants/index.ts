export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";
export const NEGOTIATION_TIMEOUT = 30;
export const RIDE_STATUS = {
  REQUESTED: "REQUESTED",
  NEGOTIATING: "NEGOTIATING",
  CONFIRMED: "CONFIRMED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;
export const MIN_PRICE_BUFFER = 0.85;
export const MAX_PRICE_BUFFER = 1.2;
