"use client";

import { useNegotiationStore } from "@/store/useNegotiationStore";

export const useNegotiation = () => {
  const state = useNegotiationStore();

  const acceptCurrentOffer = () => {
    state.acceptOffer();
  };

  return { ...state, acceptCurrentOffer };
};
