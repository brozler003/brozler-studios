"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/types/project";

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function VideoModal({
  project,
  onClose,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  // Make sure portal only renders on client.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;

    const video = videoRef.current;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    // Tell the rest of the application that the modal is active.
    document.body.dataset.videoModal = "true";

    // Completely lock page scrolling.
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC → close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // SPACE → play / pause
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "BUTTON" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();

        if (!video) return;

        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Background must never scroll while modal is active.
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("keydown", handleKeyDown);

    document.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.removeEventListener("wheel", handleWheel, true);

      document.removeEventListener(
        "touchmove",
        handleTouchMove,
        true
      );

      delete document.body.dataset.videoModal;

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow =
        previousHtmlOverflow;

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [project, onClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="
            fixed
            inset-0
            z-[2147483647]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black/85
            p-6
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseDown={onClose}
        >
          {/* Strong backdrop blur layer */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              backdrop-blur-[32px]
              bg-black/35
            "
          />

          {/* Player */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="
              relative
              z-10
              flex
              w-full
              max-w-6xl
              flex-col
              items-center
            "
          >
            {/* Video container */}
            <div
              className="
                relative
                flex
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-black
                shadow-[0_20px_100px_rgba(0,0,0,0.9)]
              "
            >
              <video
                ref={videoRef}
                src={project.video}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="
                  block
                  max-h-[78vh]
                  w-full
                  object-contain
                "
              />
            </div>

            {/* Project information */}
            <div className="mt-5 w-full text-center">
              <h2 className="
                text-2xl
                font-bold
                uppercase
                tracking-wide
                text-white
                md:text-3xl
              ">
                {project.title}
              </h2>

              <p className="
                mt-2
                text-xs
                font-medium
                uppercase
                tracking-[0.3em]
                text-zinc-400
              ">
                {project.type}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}