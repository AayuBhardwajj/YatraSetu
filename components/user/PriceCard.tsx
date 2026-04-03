import { formatPrice } from "@/lib/utils/formatPrice";

export default function PriceCard() {
  return (
    <div className="card-shell p-4">
      <p className="text-sm text-gray-500">Suggested Price</p>
      <p className="text-3xl font-bold">{formatPrice(180)}</p>
      <p className="text-sm text-gray-500">{formatPrice(150)} to {formatPrice(220)} - Moderate demand</p>
    </div>
  );
}
