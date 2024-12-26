"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RouteSummary {
  totalDistance: number;
  totalTime: number;
}

interface RouteFoundEvent {
  routes: Array<{
    summary: RouteSummary;
    waypoints: L.LatLng[];
    coordinates: L.LatLng[];
    instructions: Array<{
      type: string;
      distance: number;
      time: number;
      road?: string;
      direction?: string;
      exit?: number;
    }>;
  }>;
}

interface RoutingMachineProps {
  from: L.LatLng;
  to: L.LatLng;
  onRouteFound?: (summary: RouteSummary) => void;
}

export default function RoutingMachine({
  from,
  to,
  onRouteFound,
}: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    routingControlRef.current = L.Routing.control({
      waypoints: [from, to],
      routeWhileDragging: false,
      router: L.Routing.mapbox(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!, {
        language: "en",
      }),
      show: true,
    }).addTo(map);

    routingControlRef.current.on("routesfound", (e: RouteFoundEvent) => {
      const routes = e.routes;
      if (routes.length > 0 && onRouteFound) {
        onRouteFound(routes[0].summary);
      }
    });

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, from, to, onRouteFound]);

  useEffect(() => {
    if (routingControlRef.current) {
      routingControlRef.current.setWaypoints([from, to]);
    }
  }, [from, to]);

  return null;
}
