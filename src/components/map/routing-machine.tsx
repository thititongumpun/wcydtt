"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RoutingMachineProps {
  from: L.LatLng;
  to: L.LatLng;
}

export default function RoutingMachine({ from, to }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    routingControlRef.current = L.Routing.control({
      waypoints: [from, to],
      routeWhileDragging: false,
      router: L.Routing.mapbox(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!, {
        profile: "mapbox/driving",
        language: "en",
      }),
      show: true,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, from, to]);

  useEffect(() => {
    if (routingControlRef.current) {
      routingControlRef.current.setWaypoints([from, to]);
    }
  }, [from, to]);

  return null;
}
