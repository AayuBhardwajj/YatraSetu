export default function RidesTable() {
  return <div className="card-shell p-4 overflow-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th>Order ID</th><th>User</th><th>Driver</th><th>Route</th><th>Price</th><th>Status</th><th>Time</th><th>Actions</th></tr></thead><tbody><tr><td>R-1222</td><td>Aarav</td><td>Rakesh</td><td>HSR -> MG</td><td>₹190</td><td>Ongoing</td><td>8:20 PM</td><td><button className="underline">View</button></td></tr></tbody></table></div>;
}
