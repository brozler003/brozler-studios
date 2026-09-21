"use client";

export default function BackgroundEffects() {
  return (
    <>
      {/* ==================================================
          BASE BACKGROUND
      ================================================== */}

      <div
        className="
          fixed
          inset-0
          -z-50
          bg-black
        "
      />

      {/* ==================================================
          TOP LEFT RED GLOW

          Smaller blur radius + opacity.
          Still gives the same cinematic atmosphere
          without requiring an enormous blur surface.
      ================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -left-48
          -top-48
          -z-40
          h-[600px]
          w-[600px]
          rounded-full
          bg-red-700/10
          blur-[120px]
          transform-gpu
        "
      />

      {/* ==================================================
          BOTTOM RIGHT RED GLOW
      ================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -bottom-48
          -right-48
          -z-40
          h-[600px]
          w-[600px]
          rounded-full
          bg-red-600/8
          blur-[140px]
          transform-gpu
        "
      />

      {/* ==================================================
          VIGNETTE

          CSS gradient instead of another blur/filter.
      ================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-30
          bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.72)_100%)]
        "
      />
    </>
  );
}