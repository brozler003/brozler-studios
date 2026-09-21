"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  show?: boolean;
}

export default function Loader({
  show = true,
}: LoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black
          "
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* ==================================================
              STATIC GLOW
              
              Important:
              The glow itself is NOT animated.
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              h-[420px]
              w-[420px]
              rounded-full
              bg-red-700/10
              blur-[100px]
            "
          />

          {/* ==================================================
              OUTER RING
          ================================================== */}

          <motion.div
            initial={{
              scale: 1.15,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 0.18,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              pointer-events-none
              absolute
              h-64
              w-64
              rounded-full
              border
              border-red-500/40
            "
          />

          {/* ==================================================
              INNER RING
          ================================================== */}

          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 0.1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              pointer-events-none
              absolute
              h-44
              w-44
              rounded-full
              border
              border-white/20
            "
          />

          {/* ==================================================
              LOGO / WORDMARK
              
              No animated CSS blur.
              Only opacity + transform.
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.08,
              y: 8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              z-10
              text-center
              will-change-transform
            "
          >
            <motion.h1
              initial={{
                opacity: 0,
                scale: 1.04,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.65,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                text-6xl
                font-black
                uppercase
                tracking-[0.35em]
                text-white
                md:text-8xl
              "
            >
              BROZLER
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-5
                text-sm
                uppercase
                tracking-[0.8em]
                text-red-500
                md:text-base
              "
            >
              STUDIOS
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}