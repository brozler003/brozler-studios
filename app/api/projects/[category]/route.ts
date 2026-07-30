import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function toTitle(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const typeMap: Record<string, string> = {
    cinematics: "CAR CINEMATIC",
    "speed-ramps": "SPEED RAMP",
    brandwork: "BRAND FILM",
    specifications: "SPECIFICATION",
    bts: "BEHIND THE SCENES",
};  

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  const videoFolder = path.join(
    process.cwd(),
    "public",
    "videos",
    category
  );

  const thumbnailFolder = path.join(
    process.cwd(),
    "public",
    "thumbnails",
    category
  );

  if (!fs.existsSync(videoFolder)) {
    return NextResponse.json([]);
  }

  const videos = fs.readdirSync(videoFolder);

  const projects = videos
    .filter((file) => file.endsWith(".mp4"))
    .map((video) => {
      const name = video.replace(".mp4", "");

      let thumbnail = `${name}.png`;

      if (
        !fs.existsSync(path.join(thumbnailFolder, thumbnail))
      ) {
        thumbnail = `${name}.jpg`;
      }

        return {
            id: `${category}-${name}`,
            title: toTitle(name),
            type: typeMap[category] ?? "PROJECT",
            category,
            video: `/videos/${category}/${video}`,
            thumbnail: `/thumbnails/${category}/${thumbnail}`,
        };
    });

    

  return NextResponse.json(projects);
}