"use client";

import { useState } from "react";
import Discover from "../components/Discover";

const TABS = [
  { id: "home", label: "Home", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  {
    id: "discover",
    label: "Discover",
    icon: "M12 21s-7.5-4.6-9.3-9.2C1.4 8.3 3.4 5 6.7 5c2 0 3.5 1.1 5.3 3 1.8-1.9 3.3-3 5.3-3 3.3 0 5.3 3.300 4 6.800C19.500 16.400 12 21 12 21z",
  },
];

export default function Page() {
  const [tab, setTab] = useState("discover");

  return (
    <div className="shell">
      <main className="screen">
        {/* Home stays intentionally blank, per the brief. */}
        <section className="home" aria-label="Home" hidden={tab !== "home"} />
        {/* Discover stays mounted so its state survives tab switches. */}
        <div className="discover-wrap" hidden={tab !== "discover"}>
          <Discover active={tab === "discover"} />
        </div>
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "tab-on" : ""}`}
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => setTab(t.id)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d={t.icon} fill={tab === t.id ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
