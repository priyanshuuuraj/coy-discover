import { NextResponse } from "next/server";
import { getFeed } from "../../../lib/service.js";
import { loadState } from "../../../lib/store.js";
import * as data from "../../../lib/seed.js";

export const dynamic = "force-dynamic";

// GET /api/feed: profiles the user has not swiped on yet.
export async function GET() {
  return NextResponse.json({ profiles: getFeed(loadState(), data) });
}
