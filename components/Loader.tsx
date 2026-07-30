"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  show?: boolean;
}

export default function Loader({ show = true }: LoaderProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
          style={{ pointerEvents: show ? "auto" : "none" }}
        >
            <motion.div
                initial={{
                    scale : 1.6,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 0.18,
                }}
                transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],   
                }}
                className="
                    absolute 
                    h-72
                    w-72
                    rounded-full
                    border
                    border-red-500/40
                    "
            />
            <motion.div
                initial={{
                    scale : 0.4,
                    opacity: 0,
                }}      
                animate={{
                    scale: 1,
                    opacity: 0.1,
                }}
                transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="
                    absolute 
                    h-48
                    w-48
                    rounded-full
                    border
                    border-white/30
                    "
            />
          <motion.div
            initial={{
              filter: "blur(25px)",
              scale: 1.15,
              opacity: 0,
            }}
            animate={{
              filter: "blur(0px)",
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center"
          >
            <motion.h1
                initial={{
                    filter: "blur(20px)",
                    scale: 1.08,
                    opacity: 0,
                }}
                animate={{
                    filter: "blur(0px)",
                    scale: 1,
                    opacity: 1,
                }}
                transition={{
                    duration: 1.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="
                    text-6xl
                    md:text-8xl
                    font-black
                    tracking-[0.35em]
                    uppercase
                    text-white
                    "
            >
              BROZLER
            </motion.h1>

            <motion.p
                initial={{
                    opacity: 0,
                    y: 8,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.8,
                    duration: 0.6,
                }}
                className="
                    mt-5
                    text-sm
                    md:text-base
                    tracking-[0.8em]
                    uppercase
                    text-red-500
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