"use client";

import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { MarkerCluster } from "leaflet";
import { Result } from "@/types/EvStation";
import "leaflet-routing-machine";
import MyMarker from "./my-marker";
import GeolocateControl from "./geolocate-control";

// TypeScript props definition for LeafMap
interface LeafMapProps {
  lat: number | null;
  lng: number | null;
}

export default function LeafMap({ lat, lng }: LeafMapProps) {
  const [evStations, setEvStations] = useState<Result[]>([]);

  // Fetch nearby EV stations using TomTom API
  const fetchStations = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${latitude}&lon=${longitude}&radius=10000&language=th-TH&categorySet=7309&view=Unified&relatedPois=off&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
        );
        const data = await response.json();

        console.log(data.results);
        setEvStations(data.results);
        // lastFetchPosition.current = [latitude, longitude];
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    },
    []
  );

  const getIconUrl = (name: string) => {
    if (name.includes("PluZ")) {
      return "/pluz.png";
    } else if (name.includes("SHARGE")) {
      return "/sharge.png";
    } else if (name.includes("ON-ION")) {
      return "/onion.png";
    } else if (name.includes("EA Anywhere")) {
      return "/ea-anywhere.png";
    } else if (name.includes("Charge+")) {
      return "/chargeplus.png";
    } else if (name.includes("MEA EV")) {
      return "/mea-ev.png";
    } else if (name.includes("Q Charge")) {
      return "/qcharge.png";
    } else if (name.includes("Evolt")) {
      return "/evolt.jpeg";
    } else if (name.includes("HAUP")) {
      return "/haup.png";
    } else if (name.includes("EleXA")) {
      return "/elexa.png";
    } else {
      return "https://cdn4.iconfinder.com/data/icons/ev-charger-station/64/EV_Charger-electric_car-ecology-commercial_charging-energy-512.png";
    }
  };

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className:
        "h-12 w-12 bg-blue-500 flex text-center justify-center items-center font-bold text-lg text-white rounded-full transform -translate-x-1/4 -translate-y-1/4",
      iconSize: L.point(33, 33, true),
    });
  };

  const onHandleStationClick = (latitude: number, longitude: number) => {
    // const geoUrl = `geo:${latitude},${longitude}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${latitude},${longitude}`;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Try using the geo URL first, fallback to Google Maps if unsupported
    if (navigator.userAgent.includes("Mobile")) {
      // For mobile devices
      // window.location.href = geoUrl;
      window.location.href = appleMapsUrl;
    } else {
      // For desktop browsers
      window.open(googleMapsUrl, "_blank");
    }
  };

  useEffect(() => {
    if (lat && lng) {
      fetchStations(lat, lng);
    }
  }, [fetchStations, lat, lng]);

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
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={true}
        maxClusterRadius={100}
        spiderfyOnMaxZoom={true}
        polygonOptions={{
          fillColor: "#ffffff",
          color: "#f00800",
          weight: 5,
          opacity: 1,
          fillOpacity: 0.8,
        }}
      >
        {evStations.map((station) => (
          <Marker
            key={station.id}
            position={[station.position.lat, station.position.lon]}
            icon={L.icon({
              iconUrl: getIconUrl(station.poi.name),
              iconRetinaUrl: getIconUrl(station.poi.name),
              iconSize: [38, 38],
              popupAnchor: [0, -25],
              tooltipAnchor: [0, -20],
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
                <p>Distance: {station.dist} meters</p>
                <p>{station.address.freeformAddress}</p>
                <button
                  onClick={() =>
                    onHandleStationClick(
                      station.position.lat,
                      station.position.lon
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Route to Station
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Routing Machine */}
      {/* {lat && lng && selectedStation && (
        <RoutingMachine
          from={new L.LatLng(lat, lng)}
          to={new L.LatLng(selectedStation[0], selectedStation[1])}
        />
      )} */}
      <GeolocateControl />
      <MyMarker lat={lat} lng={lng} />
    </MapContainer>
  );
}
