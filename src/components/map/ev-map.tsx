"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MyMarker from "./my-marker";
import L from "leaflet";
import { Result } from "@/types/EvStation";
import "leaflet-routing-machine";
import RoutingMachine from "./routing-machine";

type LeafMapProps = {
  lat: number | null;
  lng: number | null;
};

export default function LeafMap({ lat, lng }: LeafMapProps) {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const lastFetchPosition = useRef<[number, number] | null>(null);
  const [selectedStation, setSelectedStation] = useState<
    [number, number] | null
  >(null);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchStations = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${latitude}&lon=${longitude}&radius=5000&language=th-TH&categorySet=7309&view=Unified&relatedPois=off&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
        );
        const data = await response.json();
        setEvStations(data.results);
        lastFetchPosition.current = [latitude, longitude];
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    },
    []
  );

  // const fetchRoute = async (
  //   startLat: number,
  //   startLng: number,
  //   endLat: number,
  //   endLng: number
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json?instructionsType=text&language=th-TH&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
  //     );
  //     const data = await response.json();

  //     const points = data.routes[0].legs[0].points.map(
  //       (point: { latitude: number; longitude: number }) => [
  //         point.latitude,
  //         point.longitude,
  //       ]
  //     );

  //     setRoute({
  //       points,
  //       summary: {
  //         lengthInMeters: data.routes[0].summary.lengthInMeters,
  //         travelTimeInSeconds: data.routes[0].summary.travelTimeInSeconds,
  //       },
  //     });

  //     setDirections(data.routes[0].guidance.instructions);
  //   } catch (error) {
  //     console.error("Error fetching route:", error);
  //   }
  // };

  const handleStationClick = (stationLat: number, stationLng: number) => {
    setSelectedStation([stationLat, stationLng]);
  };

  const handlePositionChange = useCallback(
    (newLat: number, newLng: number) => {
      if (!lastFetchPosition.current) {
        fetchStations(newLat, newLng);
        return;
      }

      const [prevLat, prevLng] = lastFetchPosition.current;
      const distance = calculateDistance(prevLat, prevLng, newLat, newLng);

      if (distance >= 1) {
        fetchStations(newLat, newLng);
      }
    },
    [fetchStations]
  );

  useEffect(() => {
    if (lat && lng) {
      handlePositionChange(lat, lng);
    }
  }, [handlePositionChange, lat, lng]);

  return (
    <MapContainer
      center={[lat as number, lng as number]}
      zoom={14}
      style={{ height: "95vh", width: "100%", position: "relative", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {evStations.map((station) => (
        <Marker
          key={station.id}
          position={[station.position.lat, station.position.lon]}
          icon={L.icon({
            iconUrl:
              "https://cdn4.iconfinder.com/data/icons/ev-charger-station/64/EV_Charger-electric_car-ecology-commercial_charging-energy-512.png",
            iconSize: [45, 45],
            popupAnchor: [2, -20],
          })}
        >
          <Popup>
            <div>
              <h3>{station.poi.name}</h3>
              <p>Categories: {station.poi.categories.join(", ")}</p>
              <p>
                Connectors:{" "}
                {station.chargingPark.connectors
                  .map(
                    (connector) =>
                      `${connector.currentType} (${connector.ratedPowerKW}kW)`
                  )
                  .join(", ")}
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() =>
                  handleStationClick(station.position.lat, station.position.lon)
                }
              >
                Route to Station
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
      {lat && lng && selectedStation && (
        <RoutingMachine
          from={new L.LatLng(lat, lng)}
          to={new L.LatLng(selectedStation[0], selectedStation[1])}
        />
      )}
      <MyMarker lat={lat} lng={lng} onPositionChange={handlePositionChange} />
    </MapContainer>
  );
}
