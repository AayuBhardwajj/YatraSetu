export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  status: "ONLINE" | "OFFLINE";
  acceptanceRate: number;
  totalTrips: number;
}
