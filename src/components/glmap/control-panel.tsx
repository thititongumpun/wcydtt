import { Result } from "@/types/EvStation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type ControlPanelProps = {
  evStations: Result[];
  onSelectStation: (station: { longitude: number; latitude: number }) => void;
};

export default function ControlPanel({
  evStations,
  onSelectStation,
}: ControlPanelProps) {
  return (
    <div className="absolute top-0 right-0 max-w-xs w-full bg-white shadow-md p-6 m-5 text-sm leading-8 text-gray-500 uppercase outline-none">
      {evStations.map((station, index) => (
        <div key={`btn-${index}`} className="flex items-center text-wrap">
          <div className="w-6">
            <Input
              type="radio"
              name="station"
              id={`station-${index}`}
              defaultChecked={index === 0}
              onClick={() =>
                onSelectStation({
                  longitude: station.position.lon,
                  latitude: station.position.lat,
                })
              }
            />
          </div>
          <Label htmlFor={`station-${index}`} className="ml-2">
            {station.poi.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
