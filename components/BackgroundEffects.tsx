"use client";

export default function BackgroundEffects() {
  return (
    <>
      {/* Base Background */}
      <div className="fixed inset-0 -z-50 bg-black" />

      {/* Red Glow - Top Left */}
      <div
        className="
          fixed
          -top-40
          -left-40
          -z-40
          h-[700px]
          w-[700px]
          rounded-full
          bg-red-700/15
          blur-[180px]
        "
      />

      {/* Red Glow - Bottom Right */}
      <div
        className="
          fixed
          -bottom-40
          -right-40
          -z-40
          h-[700px]
          w-[700px]
          rounded-full
          bg-red-600/10
          blur-[220px]
        "
      />

      {/* Vignette */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-30
          bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.75)_100%)]
        "
      />
    </>
  );
}