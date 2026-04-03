import { create } from "zustand";
import { MOCK_ML_PRICING } from "@/lib/mock/data";

interface NegotiationStore {
  userOffer: number;
  driverOffer: number | null;
  mlSuggested: number;
  mlMin: number;
  mlMax: number;
  status: "idle" | "pending" | "countered" | "accepted" | "rejected" | "timeout";
  initNegotiation: (suggested: number, min: number, max: number) => void;
  setUserOffer: (offer: number) => void;
  setDriverOffer: (offer: number | null) => void;
  acceptOffer: () => void;
  rejectOffer: () => void;
  onTimeout: () => void;
}

export const useNegotiationStore = create<NegotiationStore>((set) => ({
  userOffer: MOCK_ML_PRICING.suggestedPrice,
  driverOffer: null,
  mlSuggested: MOCK_ML_PRICING.suggestedPrice,
  mlMin: MOCK_ML_PRICING.minPrice,
  mlMax: MOCK_ML_PRICING.maxPrice,
  status: "idle",
  initNegotiation: (suggested, min, max) =>
    set({
      mlSuggested: suggested,
      mlMin: min,
      mlMax: max,
      userOffer: suggested,
      status: "idle",
    }),
  setUserOffer: (offer) => set({ userOffer: offer, status: "pending" }),
  setDriverOffer: (offer) => set({ driverOffer: offer, status: "countered" }),
  acceptOffer: () => set({ status: "accepted" }),
  rejectOffer: () => set({ status: "rejected" }),
  onTimeout: () => set({ status: "timeout" }),
}));
