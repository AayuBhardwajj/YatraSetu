"use client";

import { useNegotiationStore } from "@/store/useNegotiationStore";

export const useNegotiation = () => {
  const state = useNegotiationStore();

  const acceptCurrentOffer = () => {
    const price = state.driverOffer || state.userOffer;
    state.acceptOffer(price);
  };

  return { ...state, acceptCurrentOffer };
};
