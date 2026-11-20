// Tiny JSON-file persistence. Reads on every request so state survives reloads
// and Next.js dev-server module reloads.
import fs from "node:fs";
import path from "node:path";
import { emptyState } from "./service.js";

export function dbPath() {
  return process.env.COY_DB_PATH || path.join(process.cwd(), ".data", "db.json");
}

export function loadState() {
  try {
    const raw = JSON.parse(fs.readFileSync(dbPath(), "utf8"));
    return { swipes: raw.swipes ?? [], matches: raw.matches ?? [] };
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  const file = dbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, file); // atomic replace
}
