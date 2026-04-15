import { create } from 'zustand'
import type { NegotiationBid, RideRequest } from '@/types/rides'

interface NegotiationState {
  ride: RideRequest | null
  bids: NegotiationBid[]
  isConnected: boolean
  isFinalising: boolean
  setRide: (r: RideRequest) => void
  addBid: (b: NegotiationBid) => void
  setBids: (bids: NegotiationBid[]) => void
  setConnected: (v: boolean) => void
  setFinalising: (v: boolean) => void
  reset: () => void
}

export const useNegotiationStore = create<NegotiationState>((set) => ({
  ride: null,
  bids: [],
  isConnected: false,
  isFinalising: false,
  setRide: (r) => set({ ride: r }),
  addBid: (b) =>
    set((s) => ({
      bids: s.bids.some((x) => x.id === b.id) ? s.bids : [...s.bids, b],
    })),
  setBids: (bids) => set({ bids }),
  setConnected: (v) => set({ isConnected: v }),
  setFinalising: (v) => set({ isFinalising: v }),
  reset: () => set({ ride: null, bids: [], isConnected: false, isFinalising: false }),
}))
