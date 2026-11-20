import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  HttpError,
  emptyState,
  getFeed,
  getMatches,
  recordSwipe,
} from "../lib/service.js";
import * as data from "../lib/seed.js";

const admirer = data.likedMe[0];
const nonAdmirer = data.profiles.find((p) => !data.likedMe.includes(p.id)).id;

test("seed has 30+ profiles with every required field", () => {
  assert.ok(data.profiles.length >= 30);
  for (const p of data.profiles) {
    for (const key of ["name", "age", "photo", "bio", "place", "interests"]) {
      assert.ok(p[key] !== undefined && p[key] !== "", `${p.id} missing ${key}`);
    }
  }
  assert.ok(data.likedMe.length >= 1);
});

test("feed contains every profile before any swipe", () => {
  assert.equal(getFeed(emptyState(), data).length, data.profiles.length);
});

test("feed never leaks who liked the user", () => {
  const feed = getFeed(emptyState(), data);
  for (const p of feed) {
    assert.deepEqual(
      Object.keys(p).sort(),
      ["age", "bio", "id", "interests", "name", "photo", "place"].sort()
    );
  }
  // Admirers must not be bunched at the top of the feed.
  const top = feed.slice(0, data.likedMe.length).map((p) => p.id);
  assert.notDeepEqual(top.sort(), [...data.likedMe].sort());
});

test("swiped profiles never reappear in the feed", () => {
  const state = emptyState();
  recordSwipe(state, data, { profileId: nonAdmirer, direction: "pass" });
  recordSwipe(state, data, { profileId: admirer, direction: "like" });
  const ids = getFeed(state, data).map((p) => p.id);
  assert.ok(!ids.includes(nonAdmirer));
  assert.ok(!ids.includes(admirer));
  assert.equal(ids.length, data.profiles.length - 2);
});

test("liking someone who liked you creates a match", () => {
  const state = emptyState();
  const res = recordSwipe(state, data, { profileId: admirer, direction: "like" });
  assert.equal(res.match, true);
  assert.equal(res.profile.id, admirer);
  assert.equal(getMatches(state, data).length, 1);
});

test("liking someone who has not liked you is not a match", () => {
  const state = emptyState();
  const res = recordSwipe(state, data, { profileId: nonAdmirer, direction: "like" });
  assert.deepEqual(res, { match: false });
  assert.equal(getMatches(state, data).length, 0);
});

test("passing on an admirer never matches and looks like any other pass", () => {
  const a = emptyState();
  const b = emptyState();
  const passAdmirer = recordSwipe(a, data, { profileId: admirer, direction: "pass" });
  const passOther = recordSwipe(b, data, { profileId: nonAdmirer, direction: "pass" });
  assert.deepEqual(passAdmirer, passOther);
  assert.equal(getMatches(a, data).length, 0);
});

test("a profile cannot be swiped twice", () => {
  const state = emptyState();
  recordSwipe(state, data, { profileId: nonAdmirer, direction: "pass" });
  assert.throws(
    () => recordSwipe(state, data, { profileId: nonAdmirer, direction: "like" }),
    (e) => e instanceof HttpError && e.status === 409
  );
  assert.equal(state.swipes.length, 1);
});

test("invalid input is rejected without changing state", () => {
  const state = emptyState();
  const bad = [
    [{ profileId: "abc", direction: "like" }, 400],
    [{ profileId: nonAdmirer, direction: "superlike" }, 400],
    [{ profileId: 9999, direction: "like" }, 404],
    [undefined, 400],
  ];
  for (const [input, status] of bad) {
    assert.throws(
      () => recordSwipe(state, data, input),
      (e) => e instanceof HttpError && e.status === status
    );
  }
  assert.equal(state.swipes.length, 0);
});

test("matches list contains only mutual matches, newest first", () => {
  const state = emptyState();
  recordSwipe(state, data, { profileId: data.likedMe[0], direction: "like" });
  recordSwipe(state, data, { profileId: nonAdmirer, direction: "like" });
  recordSwipe(state, data, { profileId: data.likedMe[1], direction: "like" });
  const matches = getMatches(state, data);
  assert.deepEqual(matches.map((m) => m.id).sort(), [data.likedMe[0], data.likedMe[1]].sort());
  assert.ok(matches[0].matchedAt >= matches[1].matchedAt);
});

test("state persists to disk and reloads", async () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "coy-")), "db.json");
  process.env.COY_DB_PATH = file;
  const { loadState, saveState } = await import("../lib/store.js");

  assert.deepEqual(loadState(), emptyState()); // missing file -> empty

  const state = loadState();
  recordSwipe(state, data, { profileId: admirer, direction: "like" });
  saveState(state);

  const reloaded = loadState();
  assert.equal(reloaded.swipes.length, 1);
  assert.equal(getMatches(reloaded, data)[0].id, admirer);
  assert.ok(!getFeed(reloaded, data).some((p) => p.id === admirer));
  delete process.env.COY_DB_PATH;
});
