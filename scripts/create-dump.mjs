import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const validDumpId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validGalleries = new Set(["home", "work", "projects", "journal"]);
const [id, galleryList] = process.argv.slice(2);
const galleries = galleryList?.split(",").filter(Boolean) ?? [];

if (!id || !galleryList) {
  throw new Error("Usage: pnpm create:dump <id> <gallery[,gallery]>");
}

if (!validDumpId.test(id)) {
  throw new Error("The dump ID must contain lowercase letters or numbers separated by single hyphens.");
}

if (galleries.length === 0 || galleries.some((gallery) => !validGalleries.has(gallery))) {
  throw new Error(`Gallery must be one or more of: ${Array.from(validGalleries).join(", ")}.`);
}

if (new Set(galleries).size !== galleries.length) {
  throw new Error("Gallery IDs must be unique.");
}

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const date = `${year}/${month}/${day}`;
const title = id.replaceAll("-", " ");
const dumpDirectory = path.join(process.cwd(), "db", "dumps", id);
const metadata = {
  id,
  title,
  description: "Add a short description.",
  image: "/favicon.ico",
  width: 240,
  defaultPosition: { x: 0.5, y: 0.5 },
  galleries,
  links: {},
  body: {
    [date]: [{ type: "markdown", src: "note1.md" }],
  },
};

let createdDirectory = false;

try {
  await mkdir(dumpDirectory);
  createdDirectory = true;
  await Promise.all([
    writeFile(path.join(dumpDirectory, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
    writeFile(path.join(dumpDirectory, "note1.md"), `# ${title}\n\nWrite the first project update here.\n`, "utf8"),
  ]);
} catch (error) {
  if (createdDirectory) await rm(dumpDirectory, { recursive: true, force: true });
  throw error;
}

console.log(`Created ${path.relative(process.cwd(), dumpDirectory)} with a ${date} entry.`);
