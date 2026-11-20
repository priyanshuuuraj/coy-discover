import { NextResponse } from "next/server";
import { emptyState } from "../../../lib/service.js";
import { saveState } from "../../../lib/store.js";

export const dynamic = "force-dynamic";

// POST /api/reset: demo helper, clears all swipes and matches.
export async function POST() {
  saveState(emptyState());
  return NextResponse.json({ ok: true });
}
