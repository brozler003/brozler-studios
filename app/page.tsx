"use client";

import { useEffect, useRef, useState } from "react";

import SpeedRampSection from "../components/SpeedRampSection";
import Hero from "../components/Hero";
import CarCinematics from "../components/CarCinematics";
import BackgroundEffects from "@/components/BackgroundEffects";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import BrandWorkSection from "@/components/BrandWorkSection";
import CarSpecificationsSection from "@/components/CarSpecificationsSection";
import BTSSection from "@/components/BTSSection";

export default function Home() {
  const [heroOpen, setHeroOpen] = useState(true);
  const [readyToOpenHero, setReadyToOpenHero] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroScrollLocked, setHeroScrollLocked] = useState(true);

  // ============================================================
  // STABLE STATE REFERENCES
  //
  // These prevent the global wheel listener from being
  // repeatedly destroyed and recreated.
  // ============================================================

  const heroOpenRef = useRef(heroOpen);
  const readyToOpenHeroRef = useRef(readyToOpenHero);

  useEffect(() => {
    heroOpenRef.current = heroOpen;
  }, [heroOpen]);

  useEffect(() => {
    readyToOpenHeroRef.current = readyToOpenHero;
  }, [readyToOpenHero]);

  // ============================================================
  // LOADER
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // ============================================================
  // HERO SCROLL LOCK
  // ============================================================

  useEffect(() => {
    if (heroOpen) {
      setHeroScrollLocked(true);
      return;
    }

    // Keep the document locked during Hero exit.
    setHeroScrollLocked(true);

    const timer = setTimeout(() => {
      setHeroScrollLocked(false);
    }, 1100);

    return () => {
      clearTimeout(timer);
    };
  }, [heroOpen]);

  // ============================================================
  // DOCUMENT SCROLL LOCK
  // ============================================================

  useEffect(() => {
    if (heroScrollLocked) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [heroScrollLocked]);

  // ============================================================
  // GLOBAL WHEEL CONTROLLER
  //
  // IMPORTANT:
  // This listener is mounted only ONCE.
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (!heroOpenRef.current && y > 100) {
        setReadyToOpenHero(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const currentHeroOpen = heroOpenRef.current;
      const currentReady = readyToOpenHeroRef.current;

      // ========================================================
      // VIDEO MODAL
      // Completely ignore page scrolling.
      // ========================================================

      if (document.body.dataset.videoModal === "true") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // ========================================================
      // HERO OPEN
      // ========================================================

      if (currentHeroOpen) {
        if (e.deltaY > 0) {
          e.preventDefault();
          e.stopPropagation();

          setHeroOpen(false);
          setReadyToOpenHero(false);
        }

        return;
      }

      // ========================================================
      // HERO CLOSED
      // Detect upward movement near top.
      // ========================================================

      if (window.scrollY <= 100 && e.deltaY < 0) {
        e.preventDefault();
        e.stopPropagation();

        if (currentReady) {
          window.scrollTo({
            top: 0,
            behavior: "instant",
          });

          setHeroOpen(true);
          setReadyToOpenHero(false);
        } else {
          setReadyToOpenHero(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    document.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      document.removeEventListener("wheel", handleWheel, true);
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="bg-black text-white">
      <Loader show={loading} />

      <BackgroundEffects />

      {/* ======================================================
          SMOOTH SCROLL
      ====================================================== */}

      <SmoothScroll locked={heroScrollLocked} />

      {/* ======================================================
          HERO
      ====================================================== */}

      <Hero isOpen={heroOpen} />

      {/* ======================================================
          HOME BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => {
          setHeroOpen(true);
          setReadyToOpenHero(false);

          window.scrollTo({
            top: 0,
            behavior: "instant",
          });
        }}
        className={`
          fixed
          bottom-8
          right-8
          z-[100]
          rounded-full
          bg-red-700
          px-5
          py-3
          shadow-[0_0_30px_rgba(220,38,38,0.4)]
          backdrop-blur-md
          transition-all
          duration-300
          hover:bg-red-600
          ${
            heroOpen
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
        `}
      >
        ⌂ Home
      </button>

      {/* ======================================================
          SPACER
      ====================================================== */}

      <div className="h-[40px]" />

      {/* ======================================================
          PORTFOLIO
      ====================================================== */}

      <section
        id="portfolio"
        className="
          relative
          z-10
          bg-black
          px-8
          py-20
        "
      >
        <div className="space-y-16">

          <CarCinematics />

          <CarSpecificationsSection />

          <SpeedRampSection />

          <BrandWorkSection />

          <BTSSection />

        </div>
      </section>
    </main>
  );
}