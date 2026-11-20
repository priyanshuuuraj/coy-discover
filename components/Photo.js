"use client";

import { useState } from "react";

// Placeholder photo with a gradient + initial fallback, so the UI still looks
// right offline or if the image host is unreachable.
export default function Photo({ profile, className = "" }) {
  const [ok, setOk] = useState(true);
  const hue = (profile.id * 47) % 360;
  return (
    <div
      className={`photo ${className}`}
      style={{ background: `linear-gradient(160deg, hsl(${hue} 55% 42%), hsl(${(hue + 50) % 360} 60% 24%))` }}
    >
      <span className="photo-initial" aria-hidden="true">{profile.name[0]}</span>
      {ok && (
        <img src={profile.photo} alt="" draggable={false} loading="eager" onError={() => setOk(false)} />
      )}
    </div>
  );
}
