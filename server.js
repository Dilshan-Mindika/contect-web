// Production entry point for Spaceship / cPanel Phusion Passenger & Node.js hosting
process.env.NODE_ENV = "production";
process.chdir(__dirname);

const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");

console.log("=================================================");
console.log("Starting CONTEC Design & Build Enterprise Server");
console.log(`Working Directory : ${process.cwd()}`);
console.log(`Node Version      : ${process.version}`);
console.log(`Passenger Target  : ${process.env.PORT || "(default port 3000)"}`);
console.log("=================================================");

process.on("uncaughtException", (err) => {
  console.error("[FATAL UNCAUGHT EXCEPTION]:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL UNHANDLED REJECTION]:", reason);
});

const next = require("next");
const app = next({ dev: false, dir: __dirname, customServer: true });
const handle = app.getRequestHandler();

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const PUBLIC_DIR = path.join(__dirname, "public");

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // Direct static file serving from public/ with path traversal protection
        if (pathname && pathname !== "/" && !pathname.startsWith("/api/") && !pathname.startsWith("/_next/")) {
          const decodedPath = decodeURIComponent(pathname);
          const filePath = path.resolve(PUBLIC_DIR, "." + decodedPath);

          if (filePath.startsWith(PUBLIC_DIR + path.sep) && fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const contentType = MIME_TYPES[ext] || "application/octet-stream";

              res.writeHead(200, {
                "Content-Type": contentType,
                "Content-Length": stat.size,
                "Cache-Control": "public, max-age=31536000, immutable",
              });

              return fs.createReadStream(filePath).pipe(res);
            }
          }
        }

        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling request:", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    const rawPort = process.env.PORT;
    const hostname = process.env.HOSTNAME || "0.0.0.0";

    // Phusion Passenger compatibility (supports socket path, named pipe, or port)
    if (rawPort) {
      server.listen(rawPort, (err) => {
        if (err) {
          console.error("Listen error on Passenger target:", err);
          throw err;
        }
        console.log(`CONTEC ERP server live on Passenger target: ${rawPort}`);
      });
    } else {
      const port = 3000;
      server.listen(port, hostname, (err) => {
        if (err) {
          console.error("Listen error on port:", err);
          throw err;
        }
        console.log(`CONTEC ERP server live on http://${hostname}:${port}`);
      });
    }

    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("HTTP server closed cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  })
  .catch((ex) => {
    console.error("Failed to start Next.js server:", ex);
    process.exit(1);
  });
