// Pure business logic. No I/O here, so it is easy to test.
//
// Privacy rules enforced in this file:
//  1. The client only ever receives PUBLIC_FIELDS of a profile (never "likedMe").
//  2. The feed order is a fixed scramble, independent of who liked the user,
//     so position in the feed cannot leak admirers.
//  3. A swipe response says whether a match happened, nothing else about the
//     other person's feelings. Passing on an admirer looks identical to
//     passing on anyone else.
//  4. Matches are decided here on the server, never by the client.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const PUBLIC_FIELDS = ["id", "name", "age", "photo", "place", "bio", "interests"];
const DIRECTIONS = ["like", "pass"];

export function emptyState() {
  return { swipes: [], matches: [] };
}

export function publicProfile(profile) {
  const out = {};
  for (const key of PUBLIC_FIELDS) out[key] = profile[key];
  return out;
}

// Deterministic scramble (37 is prime and > profile count, so no ties).
function feedRank(id) {
  return (id * 17) % 37;
}

export function getFeed(state, data) {
  const swiped = new Set(state.swipes.map((s) => s.profileId));
  return data.profiles
    .filter((p) => !swiped.has(p.id))
    .sort((a, b) => feedRank(a.id) - feedRank(b.id))
    .map(publicProfile);
}

// Mutates `state`; the caller is responsible for persisting it.
export function recordSwipe(state, data, input) {
  const profileId = Number(input?.profileId);
  const direction = input?.direction;

  if (!Number.isInteger(profileId)) throw new HttpError(400, "profileId must be an integer");
  if (!DIRECTIONS.includes(direction)) throw new HttpError(400, 'direction must be "like" or "pass"');

  const profile = data.profiles.find((p) => p.id === profileId);
  if (!profile) throw new HttpError(404, "Profile not found");
  if (state.swipes.some((s) => s.profileId === profileId)) {
    throw new HttpError(409, "Already swiped on this profile");
  }

  const at = new Date().toISOString();
  state.swipes.push({ profileId, direction, at });

  const isMatch = direction === "like" && data.likedMe.includes(profileId);
  if (isMatch) {
    state.matches.push({ profileId, matchedAt: at });
    return { match: true, profile: publicProfile(profile) };
  }
  return { match: false };
}

export function getMatches(state, data) {
  return state.matches
    .map((m) => {
      const profile = data.profiles.find((p) => p.id === m.profileId);
      return profile ? { ...publicProfile(profile), matchedAt: m.matchedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.matchedAt.localeCompare(a.matchedAt));
}
