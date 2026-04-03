import type { MLPriceResponse } from "@/types/pricing";

export const pricingApi = {
  async getSuggestedPrice(): Promise<MLPriceResponse> {
    return {
      suggestedPrice: 180,
      minPrice: 150,
      maxPrice: 220,
      reason: "Moderate demand",
      eta: 12
    };
  }
};
