"use client";

export default function BookingForm() {
  return (
    <div className="card-shell p-4 space-y-3">
      <input className="w-full border rounded-xl px-3 py-3" placeholder="Where to?" />
      <button className="w-full bg-primary text-white rounded-xl h-12">Book Now</button>
    </div>
  );
}
