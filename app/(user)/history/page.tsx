"use client";

import { useState } from "react";

const rides = [{ id: "R-1001", date: "02 Apr 2026", route: "Indiranagar -> Airport", price: "₹620", status: "Completed", details: "Sedan • 42 km • 58 min" }, { id: "R-1002", date: "01 Apr 2026", route: "Koramangala -> Whitefield", price: "₹340", status: "Completed", details: "Mini • 18 km • 31 min" }];

export default function HistoryPage() {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="p-4 space-y-3 max-w-[430px] mx-auto">{rides.map((r)=><button key={r.id} onClick={()=>setOpen(open===r.id?null:r.id)} className="card-shell p-4 w-full text-left"><div className="flex justify-between"><div><p className="font-medium">{r.route}</p><p className="text-sm text-gray-500">{r.date}</p></div><div className="text-right"><p>{r.price}</p><span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{r.status}</span></div></div>{open===r.id?<p className="mt-2 text-sm text-gray-600">{r.details}</p>:null}</button>)}</div>;
}
