import { NextResponse } from "next/server";
import { getMatches } from "../../../lib/service.js";
import { loadState } from "../../../lib/store.js";
import * as data from "../../../lib/seed.js";

export const dynamic = "force-dynamic";

// GET /api/matches: the user's mutual matches, newest first.
export async function GET() {
  return NextResponse.json({ matches: getMatches(loadState(), data) });
}
