"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import RoutingMachine from "./routing-machine";
import MyMarker from "./my-marker"; // Assuming this is a custom component
import { Result } from "@/types/EvStation";
import "leaflet-routing-machine";

// TypeScript props definition for LeafMap
interface LeafMapProps {
  lat: number | null;
  lng: number | null;
}

export default function LeafMap({ lat, lng }: LeafMapProps) {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const [selectedStation, setSelectedStation] = useState<[number, number] | null>(null);
  const lastFetchPosition = useRef<[number, number] | null>(null);

  // Haversine formula for calculating distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
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

  // Fetch nearby EV stations using TomTom API
  const fetchStations = useCallback(async (latitude: number, longitude: number) => {
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
  }, []);

  // Handle station click to set route destination
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
  }, [lat, lng, handlePositionChange]);

  return (
    <MapContainer
      center={[lat ?? 0, lng ?? 0]} // Provide a default fallback for center
      zoom={14}
      style={{ height: "95vh", width: "100%", position: "relative", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      {/* Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* EV Stations Markers */}
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
                Connectors: {station.chargingPark.connectors
                  .map((connector) => `${connector.currentType} (${connector.ratedPowerKW}kW)`)
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

      {/* Routing Machine */}
      {lat && lng && selectedStation && (
        <RoutingMachine
          from={new L.LatLng(lat, lng)}
          to={new L.LatLng(selectedStation[0], selectedStation[1])}
        />
      )}

      {/* MyMarker */}
      <MyMarker
        lat={lat}
        lng={lng}
        onPositionChange={(newLat: number, newLng: number) => handlePositionChange(newLat, newLng)}
      />
    </MapContainer>
  );
}
