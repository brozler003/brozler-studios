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

export default function VideoCard({
  project,
  onClick,
  index,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [hovered, setHovered] = useState(false);

  const startPreview = () => {
    hoverTimeout.current = setTimeout(() => {
        setHovered(true);

        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, 180);
  };

  const stopPreview = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setHovered(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;

    if (!card || !video) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting){
                video.pause();
                video.currentTime = 0;
                setHovered(false);  
            }
        },
        { threshold: 0.2 }
    );

    observer.observe(card);

    return () => {
        observer.disconnect();

        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
    }

    }, []);

  return (
    <motion.div
        ref={cardRef}
      data-card
      className="group min-w-[360px] flex-shrink-0 snap-start cursor-pointer"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
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
          transition-all
          duration-300
          group-hover:border-red-600/60
          group-hover:shadow-red-900/40
        "
      >
        <div className="aspect-video">
          {/* Thumbnail */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className={`
              absolute inset-0
              h-full
              w-full
              object-cover
              transition-opacity
              duration-500
              ${hovered ? "opacity-0" : "opacity-100"}
            `}
          />

          {/* Hover Video */}
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            className={`
              absolute inset-0
              h-full
              w-full
              object-cover
              transition-opacity
              duration-500
              ${hovered ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          {/* Bottom Glass Bar */}
          <div
            className="
              absolute
              bottom-0
              w-full
              backdrop-blur-xl
              bg-black/25
              border-t
              border-white/10
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold uppercase tracking-[0.12em] text-white">
                  {project.title}
                </p>

                <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
                    {project.type}
                </p>
              </div>

              <motion.div
                animate={{
                  opacity: hovered ? 1 : 0,
                  scale: hovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
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
                <Play size={22} fill="white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}