"use client";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

export default function MemePlayer() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CldVideoPlayer
        width="1620"
        height="1080"
        src="wcydtt/759403238.85514_sjvhxp"
        colors={{
          accent: "#ff0000",
          base: "#00ff00",
          text: "#0000ff",
        }}
        fontFace="Source Serif Pro"
      />
    </main>
  );
}
