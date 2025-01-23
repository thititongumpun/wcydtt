"use client";

import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L, { LatLngExpression } from "leaflet";
import { Tooltip } from "react-leaflet";

type MyMarkerProps = {
  lat: number | null;
  lng: number | null;
  onPositionChange?: (lat: number, lng: number) => void;
};

const icon = L.icon({
  iconSize: [45, 45],
  popupAnchor: [2, -20],
  iconUrl:
    "https://github.com/thititongumpun/ev-charger-map/blob/master/public/car.png?raw=true",
});

export default function MyMarker({
  lat,
  lng,
  onPositionChange,
}: MyMarkerProps) {
  const [prevPos, setPrevPos] = useState([lat, lng]);

  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) {
      setPrevPos([lat, lng]);
    }
  }, [lat, lng, prevPos, onPositionChange]);

  useEffect(() => {
    if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng]);
  }, [lat, lng, prevPos]);

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[lat as number, lng as number]}
      previousPosition={prevPos as LatLngExpression}
      duration={3000}
    >
      <Tooltip direction="top" offset={[0, 0]} opacity={3} permanent>
        You are here 🐱‍🏍
      </Tooltip>
    </LeafletTrackingMarker>
  );
}
