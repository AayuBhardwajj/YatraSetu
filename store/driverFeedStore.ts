import { create } from 'zustand'
import type { RideRequest } from '@/types/rides'

interface DriverFeedState {
  requests: RideRequest[]
  isListening: boolean
  addRequest: (r: RideRequest) => void
  removeRequest: (id: string) => void
  setListening: (v: boolean) => void
  reset: () => void
}

export const useDriverFeedStore = create<DriverFeedState>((set) => ({
  requests: [],
  isListening: false,
  addRequest: (r) =>
    set((s) => ({
      requests: s.requests.some((x) => x.id === r.id)
        ? s.requests
        : [r, ...s.requests],
    })),
  removeRequest: (id) =>
    set((s) => ({ requests: s.requests.filter((r) => r.id !== id) })),
  setListening: (v) => set({ isListening: v }),
  reset: () => set({ requests: [], isListening: false }),
}))
