const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const STAGING_DIR = path.join(ROOT_DIR, "dist-deploy");
const OUTPUT_ZIP = path.join(ROOT_DIR, "CONTEC-Spaceship-Deploy.zip");

console.log("=================================================");
console.log("Preparing CONTEC Spaceship Deployment Package");
console.log("=================================================");

if (fs.existsSync(STAGING_DIR)) {
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
}
if (fs.existsSync(OUTPUT_ZIP)) {
  fs.unlinkSync(OUTPUT_ZIP);
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

function copyRecursive(src, dest, excludeDirs = [], excludeExts = []) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (excludeDirs.includes(base)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child), excludeDirs, excludeExts);
    }
  } else {
    const ext = path.extname(src).toLowerCase();
    if (excludeExts.includes(ext)) return;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log("1. Copying production .next build (excluding cache/dev/sourcemaps)...");
copyRecursive(path.join(ROOT_DIR, ".next"), path.join(STAGING_DIR, ".next"), ["cache", "dev"], [".map"]);

console.log("2. Copying public assets...");
copyRecursive(path.join(ROOT_DIR, "public"), path.join(STAGING_DIR, "public"));

console.log("3. Copying app/, components/, lib/, and database/...");
copyRecursive(path.join(ROOT_DIR, "app"), path.join(STAGING_DIR, "app"));
copyRecursive(path.join(ROOT_DIR, "components"), path.join(STAGING_DIR, "components"));
copyRecursive(path.join(ROOT_DIR, "lib"), path.join(STAGING_DIR, "lib"));
copyRecursive(path.join(ROOT_DIR, "database"), path.join(STAGING_DIR, "database"));

console.log("4. Copying config, entrypoints, and environment template...");
const rootFilesToCopy = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "server.js",
  "app.js",
  ".htaccess",
  ".env.example",
  "README.md",
];

for (const file of rootFilesToCopy) {
  const srcPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(STAGING_DIR, file));
  }
}

// Create uploads directory placeholder
fs.mkdirSync(path.join(STAGING_DIR, "uploads"), { recursive: true });
fs.writeFileSync(path.join(STAGING_DIR, "uploads", ".gitkeep"), "", "utf8");

const deployReadme = `# CONTEC Design & Build - Spaceship / cPanel Deployment Guide

## Quick Deployment Steps

### 1. Upload & Extract
1. Open **Spaceship cPanel** -> **File Manager**.
2. Navigate to your app directory (e.g. \`/home/username/contec-web\`).
3. Upload \`CONTEC-Spaceship-Deploy.zip\` and **Extract** all files here.

### 2. Configure Node.js Application
1. In cPanel, open **Setup Node.js App** (Node.js Selector).
2. Set:
   - **Node.js version**: **v20.x** (or v22.x)
   - **Application mode**: **Production**
   - **Application root**: Path to your extracted files
   - **Application startup file**: \`server.js\` (or \`app.js\`)
3. Click **Save**.

### 3. Install Production Dependencies
1. Click **Run NPM Install** in cPanel Node.js App Manager (or run \`npm install --omit=dev\` via Terminal).

### 4. Configure Environment & MySQL
1. Copy \`.env.example\` to \`.env\` in File Manager and fill in your live cPanel MySQL credentials, \`CONTEC_JWT_SECRET\`, SMTP settings, and \`NODE_ENV=production\`.
2. Import \`database/schema.sql\` into your cPanel MySQL database via **phpMyAdmin** (and optionally run \`npm run db:seed\`).

### 5. Restart Application
1. Click **Restart** in **Setup Node.js App** and visit your domain.
`;

fs.writeFileSync(path.join(STAGING_DIR, "README_DEPLOY.md"), deployReadme, "utf8");

console.log("5. Compressing into CONTEC-Spaceship-Deploy.zip...");
execSync(`tar -a -c -f "${OUTPUT_ZIP}" -C "${STAGING_DIR}" .`, { stdio: "inherit" });

const zipStat = fs.statSync(OUTPUT_ZIP);
const zipMB = (zipStat.size / (1024 * 1024)).toFixed(2);

console.log("=================================================");
console.log(`Deployment Archive Created: CONTEC-Spaceship-Deploy.zip (${zipMB} MB)`);
console.log("=================================================");

fs.rmSync(STAGING_DIR, { recursive: true, force: true });
