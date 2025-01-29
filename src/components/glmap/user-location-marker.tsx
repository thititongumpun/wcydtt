import { MapPin, Navigation2 } from "lucide-react";
import { Marker, Popup } from "react-map-gl";

type UserLocationMarker = {
  latitude: number | null;
  longitude: number | null;
};

export default function UserLocationMarker({
  latitude,
  longitude,
}: UserLocationMarker) {
  if (!latitude || !longitude) return null;
  return (
    <Marker latitude={latitude} longitude={longitude}>
      {/* Custom marker with navigation icon and pulsing effect */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-500/20" />

        {/* Middle pulsing ring */}
        <div className="absolute h-6 w-6 animate-pulse rounded-full bg-blue-500/30" />

        {/* Inner circle with icon */}
        <div className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
          <Navigation2
            className="h-3 w-3 -rotate-45 transform text-white"
            strokeWidth={3}
          />
        </div>
      </div>

      {/* Persistent popup */}
      <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={false}
        closeOnClick={false}
        anchor="top"
        offset={[0, 10]}
      >
        <div className="rounded-md bg-white px-2 py-1 shadow-sm">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>You are here</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
