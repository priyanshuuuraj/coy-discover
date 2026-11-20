import { NextResponse } from "next/server";
import { HttpError, recordSwipe } from "../../../lib/service.js";
import { loadState, saveState } from "../../../lib/store.js";
import * as data from "../../../lib/seed.js";

export const dynamic = "force-dynamic";

// POST /api/swipe  { profileId, direction: "like" | "pass" }
// -> { match: boolean, profile? }
export async function POST(request) {
  try {
    const body = await request.json().catch(() => {
      throw new HttpError(400, "Invalid JSON body");
    });
    const state = loadState();
    const result = recordSwipe(state, data, body);
    saveState(state);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
