import Link from "next/link";

export default function Sidebar({ links }: { links: { href: string; label: string }[] }) {
  return (
    <aside className="hidden md:block w-64 card-shell p-4 h-screen sticky top-0">
      <div className="font-bold text-primary mb-4">Ride Platform</div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-xl hover:bg-gray-100">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
