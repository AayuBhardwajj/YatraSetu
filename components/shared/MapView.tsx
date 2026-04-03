import { MapPin } from "lucide-react";

export default function MapView({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`w-full ${height} rounded-2xl bg-gray-200 flex items-center justify-center text-gray-600`}>
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        <span>Map loads here</span>
      </div>
    </div>
  );
}
