import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const videosRoot = path.join(root, "public", "videos");

function findFfmpeg() {
  // 1. Try PATH first
  const pathCheck = spawnSync("ffmpeg", ["-version"], {
    stdio: "ignore",
  });

  if (pathCheck.status === 0) {
    return "ffmpeg";
  }

  // 2. Look inside the user's WinGet installation
  const wingetRoot = path.join(
    process.env.LOCALAPPDATA ?? "",
    "Microsoft",
    "WinGet",
    "Packages"
  );

  if (fs.existsSync(wingetRoot)) {
    const packages = fs.readdirSync(wingetRoot, {
      withFileTypes: true,
    });

    for (const packageEntry of packages) {
      if (!packageEntry.isDirectory()) continue;

      if (!packageEntry.name.toLowerCase().startsWith("gyan.ffmpeg")) {
        continue;
      }

      const packagePath = path.join(wingetRoot, packageEntry.name);

      const ffmpegPath = findFileRecursive(packagePath, "ffmpeg.exe");

      if (ffmpegPath) {
        return ffmpegPath;
      }
    }
  }

  return null;
}

function findFileRecursive(directory, targetName) {
  if (!fs.existsSync(directory)) return null;

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (
      entry.isFile() &&
      entry.name.toLowerCase() === targetName.toLowerCase()
    ) {
      return fullPath;
    }

    if (entry.isDirectory()) {
      const result = findFileRecursive(fullPath, targetName);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

function getVideoFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const results = [];

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...getVideoFiles(fullPath));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".mp4")
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Checks whether the MP4 already has the "fast start" layout.
 *
 * For normal MP4 files, fast-start means the moov atom appears
 * before the mdat atom.
 */
function isFastStart(filePath) {
  const fd = fs.openSync(filePath, "r");

  try {
    const fileSize = fs.fstatSync(fd).size;

    let position = 0;

    while (position + 8 <= fileSize) {
      const header = Buffer.alloc(8);

      fs.readSync(fd, header, 0, 8, position);

      let atomSize = header.readUInt32BE(0);
      const atomType = header.toString("ascii", 4, 8);

      let headerSize = 8;

      if (atomSize === 1) {
        if (position + 16 > fileSize) return false;

        const extendedSize = Buffer.alloc(8);

        fs.readSync(fd, extendedSize, 0, 8, position + 8);

        const high = extendedSize.readUInt32BE(0);
        const low = extendedSize.readUInt32BE(4);

        atomSize = high * 4294967296 + low;
        headerSize = 16;
      }

      if (atomSize === 0) {
        atomSize = fileSize - position;
      }

      if (atomSize < headerSize) {
        return false;
      }

      if (atomType === "moov") {
        return true;
      }

      if (atomType === "mdat") {
        return false;
      }

      position += atomSize;
    }

    return false;
  } finally {
    fs.closeSync(fd);
  }
}

function optimizeVideo(ffmpeg, filePath) {
  const directory = path.dirname(filePath);
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);

  const temporaryFile = path.join(
    directory,
    `${baseName}.__faststart${extension}`
  );

  console.log(`\n⚙️ Optimizing: ${path.relative(root, filePath)}`);

  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",

      "-i",
      filePath,

      "-map",
      "0",

      "-c",
      "copy",

      "-movflags",
      "+faststart",

      "-y",
      temporaryFile,
    ],
    {
      stdio: "inherit",
      windowsHide: true,
    }
  );

  if (result.status !== 0) {
    if (fs.existsSync(temporaryFile)) {
      fs.rmSync(temporaryFile, { force: true });
    }

    throw new Error(
      `FFmpeg failed while optimizing: ${path.relative(root, filePath)}`
    );
  }

  if (!fs.existsSync(temporaryFile)) {
    throw new Error(
      `FFmpeg did not create the optimized file: ${path.relative(root, filePath)}`
    );
  }

  const originalStats = fs.statSync(filePath);
  const optimizedStats = fs.statSync(temporaryFile);

  if (optimizedStats.size === 0) {
    fs.rmSync(temporaryFile, { force: true });

    throw new Error(
      `Optimized file is empty: ${path.relative(root, filePath)}`
    );
  }

  // Replace the original with the optimized file.
  fs.rmSync(filePath, { force: true });
  fs.renameSync(temporaryFile, filePath);

  console.log(
    `✅ Optimized: ${path.relative(root, filePath)}`
  );

  console.log(
    `   Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`
  );

  console.log(
    `   Final:    ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB`
  );
}

function main() {
  console.log("");
  console.log("==========================================");
  console.log("       BROZLER VIDEO OPTIMIZER");
  console.log("==========================================");
  console.log("");

  if (!fs.existsSync(videosRoot)) {
    console.log("No public/videos directory found.");
    console.log("Nothing to optimize.");
    return;
  }

  const videos = getVideoFiles(videosRoot);

  if (videos.length === 0) {
    console.log("No MP4 videos found.");
    return;
  }

  console.log(`Found ${videos.length} MP4 video(s).`);
  console.log("");

  const videosNeedingOptimization = videos.filter(
    (filePath) => !isFastStart(filePath)
  );

  if (videosNeedingOptimization.length === 0) {
    console.log("✅ All videos are already web-optimized.");
    console.log("Nothing to do.");
    return;
  }

  console.log(
    `${videosNeedingOptimization.length} video(s) need optimization.`
  );

  console.log(
    `${videos.length - videosNeedingOptimization.length} video(s) already optimized.`
  );

  console.log("");

  const ffmpeg = findFfmpeg();

  if (!ffmpeg) {
    console.error("");
    console.error("❌ FFmpeg was not found.");
    console.error("");
    console.error(
      "Install FFmpeg with:"
    );
    console.error(
      "winget install Gyan.FFmpeg.Shared"
    );
    console.error("");

    process.exit(1);
  }

  console.log(`FFmpeg: ${ffmpeg}`);
  console.log("");

  for (const video of videosNeedingOptimization) {
    optimizeVideo(ffmpeg, video);
  }

  console.log("");
  console.log("==========================================");
  console.log("       VIDEO OPTIMIZATION COMPLETE");
  console.log("==========================================");
  console.log("");
}

main();