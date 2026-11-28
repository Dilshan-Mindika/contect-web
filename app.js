// Spaceship / cPanel Node.js Application Manager Entry Point
process.env.NODE_ENV = "production";
process.chdir(__dirname);

require("./server.js");
