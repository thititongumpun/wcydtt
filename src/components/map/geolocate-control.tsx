"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { LocateControl } from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

export default function GeolocateControl() {
  const map = useMap();
  const mapRef = useRef<L.Control.Locate | null>(null);

  useEffect(() => {
    if (!map) return;
    mapRef.current = new LocateControl({
      strings: {
        title: "Show me where I am...",
      },
      flyTo: true,
      showPopup: false,
      position: "topleft",
      drawCircle: false,
      drawMarker: false,
      keepCurrentZoomLevel: true,
      locateOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
        watch: false,
      },
      returnToPrevBounds: false,
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        map.removeControl(mapRef.current);
      }
    };
  }, [map]);

  return null;
}
