const { spawn } = require("child_process");
const http = require("http");

const child = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const checkServer = () => {
  http
    .get("http://localhost:3000", () => {
      console.log("Brozler Studios is ready.");
      console.log("Opening browser...");

      const openCommand =
        process.platform === "win32"
          ? "start"
          : process.platform === "darwin"
          ? "open"
          : "xdg-open";

      spawn(openCommand, ["http://localhost:3000"], {
        shell: true,
        detached: true,
        stdio: "ignore",
      }).unref();
    })
    .on("error", () => {
      setTimeout(checkServer, 500);
    });
};

setTimeout(checkServer, 1000);

process.on("SIGINT", () => {
  child.kill();
  process.exit();
});