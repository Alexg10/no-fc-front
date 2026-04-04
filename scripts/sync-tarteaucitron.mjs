import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/tarteaucitronjs");
const dest = join(root, "public/tarteaucitron");

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(join(src, "tarteaucitron.min.js"), join(dest, "tarteaucitron.min.js"));
await cp(
  join(src, "tarteaucitron.services.min.js"),
  join(dest, "tarteaucitron.services.min.js"),
);
await cp(join(src, "css"), join(dest, "css"), { recursive: true });
await cp(join(src, "lang"), join(dest, "lang"), { recursive: true });
console.log("Synced tarteaucitron assets to public/tarteaucitron/");
