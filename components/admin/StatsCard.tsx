export default function StatsCard({ label, value }: { label: string; value: string }) {
  return <div className="card-shell p-4"><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{value}</p></div>;
}
