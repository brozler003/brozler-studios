"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  locked?: boolean;
}

export default function SmoothScroll({
  locked = false,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;

    if (!lenis) return;

    if (locked) {
      lenis.stop();
    } else {
      lenis.scrollTo(0,{
        immediate: true,
      });
      lenis.start();
    }
  }, [locked]);
  return null;
}