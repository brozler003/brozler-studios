"use client";

import ProjectSection from "./ProjectSection";

export default function CarSpecificationsSection() {
  return (
    <ProjectSection
      title="Car Specifications"
      endpoint="/api/projects/specifications"
    />
  );
}