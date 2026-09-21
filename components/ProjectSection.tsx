"use client";

import { useEffect, useState } from "react";
import HorizontalScroller from "./HorizontalScroller";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import { motion } from "framer-motion";
import { Project } from "@/types/project";

interface Props {
  title: string;
  subtitle?: string;
  endpoint: string;
}

export default function ProjectSection({
  title,
  subtitle,
  endpoint,
}: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(endpoint, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${endpoint}`);
        }

        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error(error);

        if (!cancelled) {
          setProjects([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <>
      <motion.section
        className="
          mb-24
          contain-layout
          [content-visibility:auto]
          [contain-intrinsic-size:0_500px]
        "
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
          amount: 0.08,
          margin: "0px 0px -10% 0px",
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-red-500
              "
            >
              {title}
            </h2>

            {subtitle && (
              <p className="mt-2 text-zinc-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="text-right">
            <p
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Projects
            </p>

            <p
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              {projects.length}
            </p>
          </div>
        </div>

        <HorizontalScroller>
          {projects.map((project, index) => (
            <VideoCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelected(project)}
            />
          ))}
        </HorizontalScroller>
      </motion.section>

      <VideoModal
        project={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}