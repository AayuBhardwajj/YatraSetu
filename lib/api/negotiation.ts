import type { NegotiationPayload } from "@/types/negotiation";

export const negotiationApi = {
  async sendOffer(payload: NegotiationPayload): Promise<NegotiationPayload> {
    return payload;
  }
};
