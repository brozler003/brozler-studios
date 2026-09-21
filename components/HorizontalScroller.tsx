"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ScrollerArrow from "./ScrollerArrow";

interface Props {
  children: ReactNode;
}

export default function HorizontalScroller({
  children,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // ============================================================
  // UPDATE ARROW VISIBILITY
  // ============================================================

  const updateButtons = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    const currentScroll = container.scrollLeft;

    setShowLeft(currentScroll > 8);
    setShowRight(currentScroll < maxScrollLeft - 8);
  }, []);

  // ============================================================
  // ARROW SCROLL
  // ============================================================

  const scroll = useCallback(
    (direction: "left" | "right") => {
      const container = scrollRef.current;

      if (!container) return;

      const firstCard = container.querySelector(
        "[data-card]"
      ) as HTMLElement | null;

      const amount = firstCard
        ? firstCard.offsetWidth + 24
        : container.clientWidth * 0.9;

      container.scrollBy({
        left: direction === "right" ? amount : -amount,
        behavior: "smooth",
      });
    },
    []
  );

  // ============================================================
  // OBSERVE SIZE CHANGES
  // ============================================================

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    updateButtons();

    const resizeObserver = new ResizeObserver(() => {
      updateButtons();
    });

    resizeObserver.observe(container);

    window.addEventListener("resize", updateButtons);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  return (
    <div className="group relative w-full">
      {/* ======================================================
          LEFT GRADIENT
      ====================================================== */}

      {showLeft && (
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-20
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

      {/* ======================================================
          RIGHT GRADIENT
      ====================================================== */}

      {showRight && (
        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-20
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

      {/* ======================================================
          LEFT ARROW
      ====================================================== */}

      {showLeft && (
        <ScrollerArrow
          direction="left"
          onClick={() => scroll("left")}
        />
      )}

      {/* ======================================================
          RIGHT ARROW
      ====================================================== */}

      {showRight && (
        <ScrollerArrow
          direction="right"
          onClick={() => scroll("right")}
        />
      )}

      {/* ======================================================
          HORIZONTAL SCROLL AREA
          
          Important:
          - No scroll-smooth here.
          - Arrow buttons control their own smooth behavior.
          - Native touch/trackpad scrolling remains smooth.
          - Scrollbar is completely hidden.
      ====================================================== */}

      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="
          flex
          w-full
          gap-6
          overflow-x-auto
          overflow-y-hidden
          snap-x
          snap-mandatory
          overscroll-x-contain
          touch-pan-x
          pb-4
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {children}
      </div>
    </div>
  );
}