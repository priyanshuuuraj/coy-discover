"use client";

import Photo from "./Photo";

export default function MatchesList({ matches, loading }) {
  if (loading && matches.length === 0) return <p className="muted center-text">Loading matches…</p>;

  if (matches.length === 0) {
    return (
      <div className="empty">
        <h2>No matches yet</h2>
        <p>Someone shows up here only when you both liked each other.</p>
      </div>
    );
  }

  return (
    <ul className="matches">
      {matches.map((m) => (
        <li key={m.id} className="match-row">
          <Photo profile={m} className="match-avatar" />
          <div>
            <h3>
              {m.name}, {m.age}
            </h3>
            <p className="place">{m.place}</p>
            <p className="bio-small">{m.bio}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
