"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";
import { useGeolocation } from "@uidotdev/usehooks";
// import Pin from "./animated-pin";
import { Result } from "@/types/EvStation";
import ControlPanel from "./control-panel";
import GeocoderControl from "./geocoder-control";
import Pin from "./pin";

export default function GlMap() {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const [popupInfo, setPopupInfo] = useState<Result>();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const onSelectStation = useCallback(
    (
      { longitude, latitude }: { longitude: number; latitude: number },
      index: number
    ) => {
      // Set the selected index and start pinging
      setSelectedIndex(index);
      setIsPinging(true);

      // Fly to the selected location
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });

      // Reset ping animation after 3 seconds
      setTimeout(() => {
        setIsPinging(false);
      }, 3000);
    },
    []
  );

  const [viewport, setViewport] = useState({
    zoom: 14,
  });

  // Get geolocation using the hook
  const state = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

  // State for user's marker position
  const [userPosition, setUserPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  // Update user position when geolocation changes
  useEffect(() => {
    if (state.latitude && state.longitude) {
      setUserPosition({
        latitude: state.latitude,
        longitude: state.longitude,
      });

      setViewport((prev) => ({
        ...prev,
        latitude: state.latitude,
        longitude: state.longitude,
      }));
    }
  }, [state.latitude, state.longitude]);

  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${state.latitude}&lon=${state.longitude}&radius=10000&language=th-TH&categorySet=7309&view=Unified&relatedPois=off&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
        );
        const data = await response.json();
        setEvStations(data.results);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    }

    if (state.latitude && state.longitude) {
      fetchStations();
    }
  }, [state.latitude, state.longitude]);

  const pins = useMemo(
    () =>
      evStations.map((station, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={station.position.lon}
          latitude={station.position.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(station);
            onSelectStation(
              {
                longitude: station.position.lon,
                latitude: station.position.lat,
              },
              index
            );
          }}
        >
          <Pin
            isSelected={selectedIndex === index}
            isPinging={isPinging && selectedIndex === index}
            providerName={station.poi.name}
          />
        </Marker>
      )),
    [evStations, selectedIndex, isPinging, onSelectStation]
  );

  if (state.loading) return <div>Loading...</div>;

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={{
        longitude: state.longitude as number,
        latitude: state.latitude as number,
        zoom: viewport.zoom,
      }}
      style={{
        width: "100%",
        height: "95vh",
        position: "relative",
        zIndex: 0,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <GeocoderControl
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
        position="top-left"
      />
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
      <ControlPanel
        evStations={evStations}
        onSelectStation={onSelectStation}
        selectedIndex={selectedIndex}
        isPinging={isPinging}
      />
      {pins}

      {userPosition.latitude && userPosition.longitude && (
        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white pulse-animation" />
        </Marker>
      )}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.position.lon)}
          latitude={Number(popupInfo.position.lat)}
          onClose={() => setPopupInfo(undefined)}
        >
          <div>
            {popupInfo.poi.name}, {popupInfo.poi.categories.join(", ")}
            <p>
              Connectors:{" "}
              {popupInfo.chargingPark.connectors
                .map(
                  (connector) =>
                    `${connector.currentType} (${connector.ratedPowerKW}kW)`
                )
                .join(", ")}
            </p>
            <p>Distance: {popupInfo.dist} meters</p>
            <p>{popupInfo.address.freeformAddress}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
