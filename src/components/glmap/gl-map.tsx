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
import { Result } from "@/types/EvStation";
import ControlPanel from "./control-panel";
import GeocoderControl from "./geocoder-control";
import Pin from "./pin";
import UserLocationMarker from "./user-location-marker";
import Loading from "../Loading";
import StyleSwitcher from "./style-switcher";
import { useTheme } from "next-themes";
import _ from "lodash";
import NaviageteButton from "./navigate-button";

export default function GlMap() {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const [popupInfo, setPopupInfo] = useState<Result>();
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const { theme, setTheme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const abortControllerRef = useRef<AbortController>(null);
  const isFetchingRef = useRef(false);
  const lastFetchPosition = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Function to calculate distance between two points in kilometers
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const fetchEvStations = useCallback(
    async (latitude: number, longitude: number) => {
      // Check if this is the first fetch or if we've moved more than 1km
      if (!lastFetchPosition.current) {
        lastFetchPosition.current = { latitude, longitude };
      } else {
        const distance = calculateDistance(
          lastFetchPosition.current.latitude,
          lastFetchPosition.current.longitude,
          latitude,
          longitude,
        );

        // If distance is less than 1km, don't fetch
        if (distance < 5) {
          console.log(
            "Skipping fetch - distance less than 1km:",
            distance.toFixed(2),
            "km",
          );
          return;
        }

        // Update last fetch position
        lastFetchPosition.current = { latitude, longitude };
      }

      if (isFetchingRef.current) {
        abortControllerRef.current?.abort();
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
        return;
      }

      try {
        isFetchingRef.current = true;
        setIsFetching(true);
        abortControllerRef.current = new AbortController();

        fetchTimeoutRef.current = setTimeout(() => {
          isFetchingRef.current = false;
          setIsFetching(false);
        }, 10000);

        const response = await fetch(
          `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${latitude}&lon=${longitude}&radius=10000&language=th-TH&categorySet=7309&view=Unified&relatedPois=off&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`,
          { signal: abortControllerRef.current.signal },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setEvStations(data.results);
        console.log(
          "Fetched new stations - distance moved:",
          lastFetchPosition.current
            ? calculateDistance(
                lastFetchPosition.current.latitude,
                lastFetchPosition.current.longitude,
                latitude,
                longitude,
              ).toFixed(2) + " km"
            : "initial fetch",
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching stations:", error);
        }
      } finally {
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [],
  );

  const debouncedFetchStations = useMemo(
    () =>
      _.debounce((lat: number, lon: number) => {
        fetchEvStations(lat, lon);
      }, 5000),
    [fetchEvStations],
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      debouncedFetchStations.cancel();
      isFetchingRef.current = false;
      lastFetchPosition.current = null;
    };
  }, [debouncedFetchStations]);

  const handleMoveEnd = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      debouncedFetchStations(center.lat, center.lng);
    }
  }, [debouncedFetchStations]);

  const getMapStyle = (currentTheme: string | undefined) => {
    return currentTheme === "dark" ? "navigation-night-v1" : "streets-v12";
  };

  const [mapStyle, setMapStyle] = useState(getMapStyle(theme));

  useEffect(() => {
    setMapStyle(getMapStyle(theme));
  }, [theme]);

  const handleStyleChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const onSelectStation = useCallback(
    (
      { longitude, latitude }: { longitude: number; latitude: number },
      index: number,
    ) => {
      setSelectedIndex(index);
      setIsPinging(true);
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
      setTimeout(() => {
        setIsPinging(false);
      }, 3000);
    },
    [],
  );

  const state = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
  });

  const [userPosition, setUserPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
    heading: number | null;
  }>({
    latitude: null,
    longitude: null,
    heading: null,
  });

  useEffect(() => {
    if (state.latitude && state.longitude) {
      setUserPosition((prev) => ({
        ...prev,
        latitude: state.latitude,
        longitude: state.longitude,
      }));
    }
  }, [state.latitude, state.longitude]);

  const handleGeolocate = useCallback((event: GeolocationPosition) => {
    const heading = event.coords.heading;
    setUserHeading(heading);
    setUserPosition((prev) => ({
      ...prev,
      heading: heading,
    }));
  }, []);

  useEffect(() => {
    if (state.latitude && state.longitude) {
      fetchEvStations(state.latitude, state.longitude);
    }
  }, [state.latitude, state.longitude, fetchEvStations]);

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
        zoom: 14,
      }}
      onMoveEnd={handleMoveEnd}
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
      <StyleSwitcher onStyleChange={handleStyleChange} />

      {/* Centered loading spinner */}
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <svg
                className="h-6 w-6 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Updating stations...
              </span>
            </div>
          </div>
        </div>
      )}

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

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.position.lon)}
          latitude={Number(popupInfo.position.lat)}
          onClose={() => setPopupInfo(undefined)}
          className="text-blue-500"
        >
          <div className="max-w-sm p-2">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {popupInfo.poi.name}
              </h3>
              <p className="text-sm text-gray-600">
                {popupInfo.poi.categories.join(", ")}
              </p>
            </div>

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

            <NaviageteButton
              lat={popupInfo.position.lat}
              lon={popupInfo.position.lon}
            />
          </div>
        </Popup>
      )}
    </Map>
  );
}
