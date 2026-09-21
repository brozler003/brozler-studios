"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Project } from "@/types/project";

interface Props {
  project: Project;
  onClick: () => void;
  index: number;
}

// ============================================================
// GLOBAL PREVIEW CONTROLLER
// Only one preview can play at a time.
// ============================================================

let stopActivePreview: (() => void) | null = null;

export default function VideoCard({
  project,
  onClick,
  index,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [hovered, setHovered] = useState(false);

  // ============================================================
  // STOP PREVIEW
  // ============================================================

  const stopPreview = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    setHovered(false);

    const video = videoRef.current;

    if (!video) return;

    video.pause();

    video.removeAttribute("src");
    video.load();
  };

  // ============================================================
  // START PREVIEW
  // ============================================================

  const startPreview = () => {
    hoverTimeout.current = setTimeout(() => {
      const video = videoRef.current;

      if (!video) return;

      // Stop previous active preview.
      if (stopActivePreview) {
        stopActivePreview();
      }

      stopActivePreview = stopPreview;

      // Attach video ONLY when actually needed.
      video.src = project.video;
      video.load();

      setHovered(true);

      video.play().catch(() => {});
    }, 180);
  };

  // ============================================================
  // VISIBILITY CONTROL
  // ============================================================

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          stopPreview();

          if (stopActivePreview === stopPreview) {
            stopActivePreview = null;
          }
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(card);

    return () => {
      observer.disconnect();

      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }

      if (stopActivePreview === stopPreview) {
        stopActivePreview = null;
      }

      stopPreview();
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      data-card
      className="
        group
        min-w-[360px]
        flex-shrink-0
        snap-start
        cursor-pointer
        will-change-transform
      "
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={onClick}

      // ========================================================
      // LIGHTWEIGHT ENTRANCE ANIMATION
      //
      // No filter blur.
      // Only opacity + transform.
      // ========================================================

      initial={{
        opacity: 0,
        y: 32,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.15,
      }}

      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}

      // ========================================================
      // LIGHTWEIGHT HOVER
      // ========================================================

      whileHover={{
        y: -6,
        scale: 1.015,
      }}
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-900
          shadow-lg
          transition-[border-color,box-shadow]
          duration-300
          group-hover:border-red-600/60
          group-hover:shadow-red-900/40
        "
      >
        <div className="aspect-video">

          {/* ==================================================
              THUMBNAIL
          ================================================== */}

          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className={`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-opacity
              duration-300
              ${hovered ? "opacity-0" : "opacity-100"}
            `}
          />

          {/* ==================================================
              4K60 PREVIEW
          ================================================== */}

          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-opacity
              duration-300
              ${hovered ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* ==================================================
              GRADIENT
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-black/10
              to-transparent
            "
          />

          {/* ==================================================
              INFO BAR
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              w-full
              border-t
              border-white/10
              bg-black/25
              p-5
              backdrop-blur-lg
            "
          >
            <div className="flex items-center justify-between">

              <div className="space-y-1">

                <p
                  className="
                    text-lg
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-white
                  "
                >
                  {project.title}
                </p>

                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-zinc-400
                  "
                >
                  {project.type}
                </p>

              </div>

              {/* ==================================================
                  PLAY INDICATOR
              ================================================== */}

              <motion.div
                animate={{
                  opacity: hovered ? 1 : 0,
                  scale: hovered ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  shadow-lg
                "
              >
                <Play
                  size={22}
                  fill="white"
                />
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}