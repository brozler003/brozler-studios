"use client";

import { motion } from "framer-motion";

interface HeroProps {
  isOpen: boolean;
}

export default function Hero({ isOpen }: HeroProps) {
  return (
    <motion.section
    animate={{
        y: isOpen ? 0 : "-100vh",
        opacity: isOpen ? 1 : 0.95,
    }}
      transition={{
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 z-50"
    >
      <div className="relative overflow-hidden h-full flex flex-col justify-center items-center px-6 text-white bg-[radial-gradient(circle_at_top,#3a0000_0%,#120000_30%,#000000_100%)]">

        <div className="breathing-bg absolute w-[1200px] h-[1200px] rounded-full bg-red-800/25 blur-[220px]" />

        <div
          className="breathing-bg absolute w-[700px] h-[700px] rounded-full bg-red-700/20 blur-[180px]"
          style={{ animationDelay: "3s" }}
        />

        <img
          src="/logo.png"
          alt="Brozler Studios"
          className="logoFloat relative z-10 w-52 h-52 rounded-full object-cover border-4 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.4)]"
        />

        <h1 className="relative z-10 text-5xl md:text-7xl font-bold mt-8 tracking-[0.2em] text-center">
          BROZLER STUDIOS
        </h1>

        <p className="relative z-10 text-gray-300 text-center max-w-3xl mt-6 text-lg">
          Automotive Cinematics & Brand Visuals
        </p>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-xs tracking-[0.35em] mb-2 text-gray-500">
              SCROLL
            </span>

            <span className="text-5xl">⌄</span>
          </div>
        </div>

      </div>
    </motion.section>
  );
}