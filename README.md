<<<<<<< HEAD
# Coy Discover

A swipe-based "Discover" tab built for the Coy SDE intern assignment (Part B).
Next.js 14 (App Router) + API routes, JSON-file persistence, framer-motion for gestures.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (open in mobile view for drag gestures)
npm test           # backend logic tests (Node's built-in test runner)
```

Swipes and matches are stored in `.data/db.json`, so they survive page reloads and
server restarts. The empty state has a **Reset demo data** button (calls `POST /api/reset`).

## Controls

| Action | Mobile | Desktop |
| --- | --- | --- |
| Like | drag right | Like button or `→` |
| Pass | drag left | Pass button or `←` |

## Demo: trigger a match

Eight seeded profiles have already liked you: Meera, Tara, Yash, Riya, Zoya, Rahul, Kunal and Naina.
Like any of them to see the "It's a match!" screen. Liking anyone else (or passing on these eight) never matches.

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/feed` | Profiles not yet swiped on. Returns `{ profiles }` |
| `POST /api/swipe` | Body `{ profileId, direction: "like" \| "pass" }`. Returns `{ match: boolean, profile? }`. `409` if already swiped, `400`/`404` on bad input |
| `GET /api/matches` | Mutual matches, newest first. Returns `{ matches }` |
| `POST /api/reset` | Demo helper: clears swipes and matches |

## How the privacy promise is kept

- **"Who liked me" lives only on the server** (`lib/seed.js`) and is never serialised. Profiles sent to the client are whitelisted to public fields (`publicProfile` in `lib/service.js`).
- **Feed order doesn't leak.** The feed uses a fixed scramble that ignores who liked you, so admirers can't be spotted by appearing first.
- **Pass looks the same for everyone.** A swipe response is `{ match: false }` whether or not the person had liked you.
- **The server decides matches.** The client only reports a like or pass; a match exists only when both sides liked.
- **A profile can't be swiped twice** (`409`), so a pass can't be flipped into a like to probe for admirers.

## Structure

```
app/            page (tab bar), layout, styles, API routes
components/     Discover, SwipeCard, MatchModal, MatchesList, Photo
lib/service.js  pure feed / swipe / match logic (unit-tested)
lib/store.js    JSON-file persistence
lib/seed.js     32 mock profiles + admirer ids (server-only)
tests/          node:test suite
```

## Notes

Photos come from picsum.photos placeholders; if they can't load (offline), each card falls back to a gradient with the person's initial.
=======
# coy-discover
>>>>>>> 20eac73ec9b519f1d0c5c614bca9a1349b206b54
