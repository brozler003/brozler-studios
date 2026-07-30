"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import ScrollerArrow from "./ScrollerArrow";

interface Props {
  children: ReactNode;
}

export default function HorizontalScroller({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateButton = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const firstCard = scrollRef.current.querySelector(
      "[data-card]"
    ) as HTMLElement | null;

    const amount = firstCard?.offsetWidth
      ? firstCard.offsetWidth + 24 // gap-6 = 24px
      : scrollRef.current.clientWidth * 0.9;

    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      setTimeout(updateButton, 350);
    });
  };

  useEffect(() => {
    updateButton();

    window.addEventListener("resize", updateButton);

    return () => {
      window.removeEventListener("resize", updateButton);
    };
  }, []);

  return (
    <div className="relative group">
      {/* Left Gradient */}
      {showLeft && (
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-10
            h-full
            w-28
            bg-gradient-to-r
            from-black
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />
      )}

      {/* Right Gradient */}
      {showRight && (
        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-10
            h-full
            w-28
            bg-gradient-to-l
            from-black
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />
      )}

      {/* Left Arrow */}
      {showLeft && (
        <ScrollerArrow
          direction="left"
          onClick={() => scroll("left")}
        />
      )}

      {/* Right Arrow */}
      {showRight && (
        <ScrollerArrow
          direction="right"
          onClick={() => scroll("right")}
        />
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={updateButton}
        className="
          flex
          gap-6
          overflow-x-auto
          scroll-smooth
          snap-x
          pb-4
          scrollbar-hide
        "
      >
        {children}
      </div>
    </div>
  );
}