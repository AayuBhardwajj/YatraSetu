export default function PricingConfig() {
  return <div className="card-shell p-4 space-y-3"><input className="w-full border rounded-xl px-3 py-3" placeholder="Min price" /><input className="w-full border rounded-xl px-3 py-3" placeholder="Max price" /><input type="range" min={1} max={3} step={0.1} defaultValue={1.5} className="w-full" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Surge enabled</label></div>;
}
