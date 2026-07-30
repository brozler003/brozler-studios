"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  direction: "left" | "right";
  onClick: () => void;
}

export default function ScrollerArrow({
  direction,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        absolute
        top-1/2
        -translate-y-1/2
        z-20
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-black/70
        backdrop-blur-md
        text-white
        opacity-0
        transition-all
        duration-300
        ${direction === "left" ? "-translate-x-2" : "translate-x-2"}
        group-hover:opacity-100
        group-hover:translate-x-0
        hover:scale-110
        hover:bg-red-600
        ${direction === "left" ? "left-2" : "right-2"}
      `}
    >
      {direction === "left" ? (
        <ChevronLeft size={24} />
      ) : (
        <ChevronRight size={24} />
      )}
    </button>
  );
}