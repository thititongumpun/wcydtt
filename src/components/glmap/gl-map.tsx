"use client";

import { useEffect, useMemo, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl";
import { useGeolocation } from "@uidotdev/usehooks";
import Pin from "./pin";
import { Result } from "@/types/EvStation";

export default function GlMap() {
  const [evStations, setEvStations] = useState<Result[]>([]);
  const [popupInfo, setPopupInfo] = useState<Result>();
  const state = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

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
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(station);
          }}
        >
          <Pin />
        </Marker>
      )),
    [evStations]
  );

  if (state.loading) return <div>Loading...</div>;

  return (
    <div>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: state.longitude as number,
          latitude: state.latitude as number,
          zoom: 14,
        }}
        style={{ width: "100%", height: "95vh", position: "relative", zIndex: 0 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {pins}

        <Marker 
          latitude={state.latitude as number}
          longitude={state.longitude as number}
        />

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
    </div>
  );
}
