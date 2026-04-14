// ── Auth ─────────────────────────────────────────────────────
export type UserRole = 'user' | 'driver'
export type VehicleType = 'auto' | 'bike' | 'cab'
export type DocType = 'aadhaar' | 'pan' | 'dl' | 'rc'

// ── Database Row Types ────────────────────────────────────────
export interface UserProfile {
  user_id: string
  full_name: string | null
  phone: string | null
  city: string | null
  avatar_url: string | null
  role: UserRole
  is_profile_complete: boolean
  created_at: string
}

export interface DriverProfile {
  user_id: string
  full_name: string | null
  phone: string | null
  city: string | null
  aadhaar_number: string | null
  pan_number: string | null
  dl_number: string | null
  upi_id: string | null
  bank_account: string | null
  bank_ifsc: string | null
  vehicle_type: VehicleType | null
  is_available: boolean
  is_verified: boolean
  onboarding_step: number
  is_onboarding_complete: boolean
  created_at: string
}

export interface DriverDocument {
  id: string
  driver_id: string
  doc_type: DocType
  file_url: string
  cloudinary_id: string
  uploaded_at: string
}

export interface Vehicle {
  id: string
  driver_id: string
  vehicle_type: VehicleType
  make: string
  model: string
  plate_number: string
  year: number
  created_at: string
}

// ── Legacy (kept for backward compat with existing pages) ─────
export interface User {
  id: string
  name: string
  email: string
  phone: string
  walletBalance: number
}

export interface Driver {
  id: string
  name: string
  rating: number
  vehicle: string
  plate: string
  status: 'ONLINE' | 'OFFLINE'
  acceptanceRate: number
  totalTrips: number
}
