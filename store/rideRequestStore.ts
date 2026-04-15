import { create } from 'zustand'
import type { RideRequest } from '@/types/rides'

interface RideRequestState {
  activeRequest: RideRequest | null
  isCreating: boolean
  error: string | null
  setActiveRequest: (r: RideRequest | null) => void
  setCreating: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const useRideRequestStore = create<RideRequestState>((set) => ({
  activeRequest: null,
  isCreating: false,
  error: null,
  setActiveRequest: (r) => set({ activeRequest: r }),
  setCreating: (v) => set({ isCreating: v }),
  setError: (e) => set({ error: e }),
  reset: () => set({ activeRequest: null, isCreating: false, error: null }),
}))
