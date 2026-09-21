import fs from "fs";
import path from "path";

const root = process.cwd();

const videosRoot = path.join(root, "public", "videos");
const thumbnailsRoot = path.join(root, "public", "thumbnails");

const outputDirectory = path.join(root, "generated");
const outputFile = path.join(outputDirectory, "projects.ts");

const typeMap = {
  cinematics: "CAR CINEMATIC",
  "speed-ramps": "SPEED RAMP",
  brandwork: "BRAND FILM",
  specifications: "SPECIFICATION",
  bts: "BEHIND THE SCENES",
};

function toTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function getThumbnail(category, filename) {
  const name = filename.replace(/\.[^/.]+$/, "");

  const png = path.join(
    thumbnailsRoot,
    category,
    `${name}.png`
  );

  const jpg = path.join(
    thumbnailsRoot,
    category,
    `${name}.jpg`
  );

  if (fs.existsSync(png)) {
    return `/thumbnails/${category}/${name}.png`;
  }

  if (fs.existsSync(jpg)) {
    return `/thumbnails/${category}/${name}.jpg`;
  }

  return null;
}

function getCategories() {
  if (!fs.existsSync(videosRoot)) {
    return [];
  }

  return fs
    .readdirSync(videosRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

const projects = {};

for (const category of getCategories()) {
  const videoFolder = path.join(videosRoot, category);

  const videos = fs
    .readdirSync(videoFolder, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.toLowerCase().endsWith(".mp4")
    )
    .map((entry) => entry.name);

  projects[category] = videos
    .map((video) => {
      const name = video.replace(/\.mp4$/i, "");
      const thumbnail = getThumbnail(category, video);

      if (!thumbnail) {
        console.warn(
          `⚠️ No thumbnail found for: ${category}/${video}`
        );

        return null;
      }

      return {
        id: `${category}-${name}`,
        title: toTitle(name).toUpperCase(),
        type: typeMap[category] ?? "PROJECT",
        category,
        video: `/videos/${category}/${video}`,
        thumbnail,
      };
    })
    .filter(Boolean);
}

fs.mkdirSync(outputDirectory, { recursive: true });

const output = `// AUTO-GENERATED FILE
// DO NOT EDIT MANUALLY.

export const projects = ${JSON.stringify(
  projects,
  null,
  2
)} as const;
`;

fs.writeFileSync(outputFile, output, "utf8");

console.log("✅ Project manifest generated.");
console.log(`📁 ${outputFile}`);

for (const [category, items] of Object.entries(projects)) {
  console.log(`   ${category}: ${items.length} project(s)`);
}