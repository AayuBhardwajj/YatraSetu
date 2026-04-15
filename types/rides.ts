export type RideStatus =
  | 'open'
  | 'negotiating'
  | 'accepted'
  | 'cancelled'
  | 'expired'

export interface RideRequest {
  id: string
  created_at: string
  expires_at: string
  passenger_id: string
  pickup_lat: number
  pickup_lng: number
  pickup_label: string
  drop_lat: number
  drop_lng: number
  drop_label: string
  distance_km: number
  suggested_price: number
  final_price: number | null
  status: RideStatus
  accepted_driver_id: string | null
}

export interface NegotiationBid {
  id: string
  created_at: string
  ride_id: string
  bidder_id: string
  bidder_role: 'passenger' | 'driver'
  amount: number
  is_accepted: boolean
}

export interface PricingInput {
  distanceKm: number
  driverMileageKmpl: number
  hourOfDay: number
  dayOfWeek: number
  activeRequests: number
  onlineDrivers: number
}

export interface PricingResult {
  price: number
  breakdown: {
    baseFare: number
    distanceFare: number
    fuelSurcharge: number
    demandMultiplier: number
    timeMultiplier: number
  }
}
