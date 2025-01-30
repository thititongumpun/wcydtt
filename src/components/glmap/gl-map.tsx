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
import UserLocationMarker from "./user-location-marker";
import Loading from "../Loading";
import StyleSwitcher from "./style-switcher";
import { useTheme } from "next-themes";

export default function GlMap() {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const [popupInfo, setPopupInfo] = useState<Result>();
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const { theme, setTheme } = useTheme();
  // Define map style based on theme
  const getMapStyle = (currentTheme: string | undefined) => {
    return currentTheme === "dark" ? "navigation-night-v1" : "streets-v12";
  };

  const [mapStyle, setMapStyle] = useState(getMapStyle(theme));
  const mapRef = useRef<MapRef>(null);

  // Update map style when theme changes
  useEffect(() => {
    setMapStyle(getMapStyle(theme));
  }, [theme]);

  const handleStyleChange = () => {
    // Toggle theme between light and dark
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const onSelectStation = useCallback(
    (
      { longitude, latitude }: { longitude: number; latitude: number },
      index: number,
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
    [],
  );

  const [viewport, setViewport] = useState({
    zoom: 14,
  });

  // Get geolocation using the hook
  const state = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
  });

  // State for user's marker position
  const [userPosition, setUserPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
    heading: number | null;
  }>({
    latitude: null,
    longitude: null,
    heading: null,
  });

  // Update user position when geolocation changes
  useEffect(() => {
    if (state.latitude && state.longitude) {
      setUserPosition((prev) => ({
        ...prev,
        latitude: state.latitude,
        longitude: state.longitude,
      }));

      setViewport((prev) => ({
        ...prev,
        latitude: state.latitude,
        longitude: state.longitude,
      }));
    }
  }, [state.latitude, state.longitude]);

  // Handle geolocate events
  const handleGeolocate = useCallback((event: GeolocationPosition) => {
    const heading = event.coords.heading;
    setUserHeading(heading);
    setUserPosition((prev) => ({
      ...prev,
      heading: heading,
    }));
  }, []);

  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${state.latitude}&lon=${state.longitude}&radius=10000&language=th-TH&categorySet=7309&view=Unified&relatedPois=off&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`,
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
              index,
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
    [evStations, selectedIndex, isPinging, onSelectStation],
  );

  if (state.loading) return <Loading />;

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
      mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
    >
      <GeocoderControl
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!}
        position="top-left"
      />
      <GeolocateControl
        position="top-left"
        trackUserLocation
        showUserHeading
        showUserLocation
        showAccuracyCircle={false}
        onGeolocate={handleGeolocate}
      />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl position="top-left" />
      {/* Add the style switcher */}
      <StyleSwitcher onStyleChange={handleStyleChange} />
      <ControlPanel
        evStations={evStations}
        onSelectStation={onSelectStation}
        selectedIndex={selectedIndex}
        isPinging={isPinging}
      />
      {pins}

      {userPosition.latitude && userPosition.longitude && (
        <UserLocationMarker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          heading={userHeading}
        />
      )}

      {/* {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.position.lon)}
          latitude={Number(popupInfo.position.lat)}
          onClose={() => setPopupInfo(undefined)}
          className="text-blue-500"
        >
          <div>
            {popupInfo.poi.name}, {popupInfo.poi.categories.join(", ")}
            <p>
              Connectors:{" "}
              {popupInfo.chargingPark.connectors
                .map(
                  (connector) =>
                    `${connector.currentType} (${connector.ratedPowerKW}kW)`,
                )
                .join(", ")}
            </p>
            <p>Distance: {popupInfo.dist} meters</p>
            <p>{popupInfo.address.freeformAddress}</p>
          </div>
        </Popup>
      )} */}
      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.position.lon)}
          latitude={Number(popupInfo.position.lat)}
          onClose={() => setPopupInfo(undefined)}
          className="text-blue-500"
        >
          <div className="max-w-sm p-2">
            {/* Station Name and Categories */}
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {popupInfo.poi.name}
              </h3>
              <p className="text-sm text-gray-600">
                {popupInfo.poi.categories.join(", ")}
              </p>
            </div>

            {/* Connectors */}
            <div className="mb-3">
              <h4 className="mb-1 font-medium text-gray-700">
                Available Connectors:
              </h4>
              <div className="grid gap-1">
                {popupInfo.chargingPark.connectors.map((connector, index) => (
                  <div
                    key={index}
                    className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-700"
                  >
                    {connector.currentType} ({connector.ratedPowerKW}kW)
                  </div>
                ))}
              </div>
            </div>

            {/* Distance and Address */}
            <div className="mb-3">
              <p className="mb-1 text-sm text-gray-600">
                <span className="font-medium">Distance:</span>{" "}
                {(popupInfo.dist / 1000).toFixed(2)} km
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span>{" "}
                {popupInfo.address.freeformAddress}
              </p>
            </div>

            {/* Google Maps Button */}
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${popupInfo.position.lat},${popupInfo.position.lon}`;
                window.open(url, "_blank");
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Navigate with Google Maps
            </button>
          </div>
        </Popup>
      )}
    </Map>
  );
}
