"use client";

import SpeedRampSection from "../components/SpeedRampSection";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (heroOpen && y > 20) {
        window.scrollTo(0, 0);
        setHeroOpen(false);
      }

      if (!heroOpen && y > 100) {
        setReadyToOpenHero(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!heroOpen && window.scrollY <= 100 && e.deltaY < 0) {
        if (readyToOpenHero) {
          window.scrollTo(0, 0);
          setHeroOpen(true);
          setReadyToOpenHero(false);
        } else {
          setReadyToOpenHero(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [heroOpen, readyToOpenHero]);

  return (
    <main className="bg-black text-white">
      <Loader show={loading} />
      
      <BackgroundEffects />
      <Hero isOpen={heroOpen} />

      {/* Home Button */}
      <button
        onClick={() => {
          setHeroOpen(true);
          window.scrollTo(0, 0);
        }}
        className={`
          fixed bottom-8 right-8 z-[100]
          px-5 py-3 rounded-full
          bg-red-700 hover:bg-red-600
          transition-all duration-300
          shadow-[0_0_30px_rgba(220,38,38,0.4)]
          backdrop-blur-md
          ${heroOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        ⌂ Home
      </button>

      {/* Spacer */}
      <div className="h-[40px]" />

      <section
        id="portfolio"
        className="relative bg-black px-8 py-20 z-10"
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