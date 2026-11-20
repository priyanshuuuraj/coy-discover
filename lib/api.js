// Client-side helpers for the backend routes.
async function request(url, options) {
  const res = await fetch(url, { cache: "no-store", ...options });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || "Request failed");
    err.status = res.status;
    throw err;
  }
  return body;
}

export async function fetchFeed() {
  return (await request("/api/feed")).profiles;
}

export async function fetchMatches() {
  return (await request("/api/matches")).matches;
}

export function postSwipe(profileId, direction) {
  return request("/api/swipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, direction }),
  });
}

export function resetDemo() {
  return request("/api/reset", { method: "POST" });
}
