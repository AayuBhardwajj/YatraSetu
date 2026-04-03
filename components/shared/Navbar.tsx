export default function Navbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card-shell p-4 mb-3">
      <h1 className="text-lg font-semibold">{title}</h1>
      {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
    </div>
  );
}
