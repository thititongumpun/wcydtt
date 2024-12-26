"use client";

import MapLoading from "@/components/Loading";
import { useGeolocation } from "@uidotdev/usehooks";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/ev-map"), {
  ssr: false,
  loading: () => <div></div>,
});

export default function EvMapPage() {
  const state = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000,
  });

  if (state.loading) {
    return <MapLoading />;
  }

  return <Map lat={state.latitude} lng={state.longitude} />;
}
