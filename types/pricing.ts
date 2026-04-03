export interface MLPriceResponse {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  reason: string;
  eta: number;
}
