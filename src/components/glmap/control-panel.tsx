import { Result } from "@/types/EvStation";

type ControlPanelProps = {
  evStations: Result[];
  onSelectStation: (station: { longitude: number; latitude: number }) => void;
};

export default function ControlPanel({
  evStations,
  onSelectStation,
}: ControlPanelProps) {
  return (
    <div className="absolute top-0 right-0 max-w-[320px] bg-white shadow-md p-6 m-5 text-sm leading-8 text-gray-500 uppercase outline-none">
      <h3>Camera Transition</h3>
      <p>Smooth animate of the viewport.</p>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-map-gl/tree/7.1-release/examples/viewport-animation"
          target="_new"
        >
          View Code ↗
        </a>
      </div>
      <hr />

      {evStations.map((station, index) => (
        <div key={`btn-${index}`} className="input">
          <input
            type="radio"
            name="city"
            id={`city-${index}`}
            // defaultChecked={city.city === "San Francisco"}
            // onClick={() => props.onSelectCity(city)}
            onClick={() =>
              onSelectStation({
                longitude: station.position.lon,
                latitude: station.position.lat,
              })
            }
          />
          <label htmlFor={`city-${index}`}>{station.poi.name}</label>
          {/* <label htmlFor={`city-${index}`}>{city.city}</label> */}
        </div>
      ))}
    </div>
  );
}
