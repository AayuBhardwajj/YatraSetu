"use client";

import { useEffect, useState } from "react";

export default function DriverNegotiatePage() {
  const [counter, setCounter] = useState(195);
  const [time, setTime] = useState(30);
  useEffect(() => { const id = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000); return () => clearInterval(id); }, []);
  return <div className="p-2 space-y-3"><div className="card-shell p-4"><p>User offer</p><p className="text-3xl font-bold">₹180</p><p className="text-sm">ML range: ₹150 - ₹220</p></div><input type="number" min={150} max={220} value={counter} onChange={(e) => setCounter(Number(e.target.value))} className="w-full border rounded-xl px-3 py-3" /><div className="card-shell p-3 text-center">00:{String(time).padStart(2, "0")}</div><div className="grid grid-cols-3 gap-2"><button className="h-12 rounded-xl bg-primary text-white">Accept</button><button className="h-12 rounded-xl border">Send Counter</button><button className="h-12 rounded-xl border">Decline</button></div></div>;
}
