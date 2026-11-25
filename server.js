// Shared hosting (cPanel / Spaceship Phusion Passenger) entry point.
// Uses the prebuilt Next.js standalone server when present for minimal RAM usage,
// or falls back to standard Next.js app server when running from full source.
const fs = require('fs');
const path = require('path');

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServer)) {
  require(standaloneServer);
} else {
  const http = require('http');
  const next = require('next');

  const dev = process.env.NODE_ENV !== 'production';
  const hostname = process.env.HOSTNAME || '0.0.0.0';
  const port = parseInt(process.env.PORT || '3000', 10);

  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        console.log(`> CONTEC ERP ready on http://${hostname}:${port}`);
      });
  });
}
