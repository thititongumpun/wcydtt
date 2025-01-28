"use client";

import * as React from "react";

type PinProps = {
  size?: number;
  isSelected?: boolean;
  isPinging?: boolean;
};

function Pin({ size = 20, isSelected, isPinging }: PinProps) {
  return (
    <div className="relative">
      {/* Pin SVG */}
      <svg
        height={size}
        viewBox="0 0 24 24"
        className={`fill-current transform transition-all duration-300 ${
          isSelected ? "text-blue-500 scale-110" : "text-red-500"
        }`}
      >
        <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
      </svg>

      {/* Ping animation rings */}
      {isPinging && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/50 rounded-full animate-ping" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500/30 rounded-full animate-pulse" />
        </>
      )}
    </div>
  );
}

export default React.memo(Pin);
