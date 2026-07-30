"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Project } from "@/types/project";

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function VideoModal({
  project,
  onClose,
}: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling
    document.body.style.overflow = project ? "hidden" : "auto";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl"
          >
            <button
              onClick={onClose}
              className="absolute -top-14 right-0 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-red-600 transition"
            >
              <X size={22} />
            </button>

            <video
              src={project.video}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[85vh] rounded-3xl bg-black object-contain"
            />

            <div className="mt-6">
              <h2 className="text-3xl font-bold text-white uppercase">
                {project.title}
              </h2>

              <p className="mt-2 text-zinc-400">
                Automotive Cinematic
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}