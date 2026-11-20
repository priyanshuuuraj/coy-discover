"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFeed, fetchMatches, postSwipe, resetDemo } from "../lib/api";
import SwipeCard from "./SwipeCard";
import Photo from "./Photo";
import MatchModal from "./MatchModal";
import MatchesList from "./MatchesList";

export default function Discover({ active }) {
  const [queue, setQueue] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [view, setView] = useState("swipe"); // swipe | matches
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [justMatched, setJustMatched] = useState(null);
  const [notice, setNotice] = useState("");
  const cardRef = useRef(null);

  const loadFeed = useCallback(async () => {
    setStatus("loading");
    try {
      setQueue(await fetchFeed());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      setMatches(await fetchMatches());
    } catch {
      /* the list just stays as it was */
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const top = queue[0];

  const handleSwiped = useCallback(
    async (direction) => {
      if (!top) return;
      const swiped = top;
      setQueue((q) => q.slice(1)); // optimistic: card is already off-screen
      try {
        const res = await postSwipe(swiped.id, direction);
        if (res.match) {
          setJustMatched(res.profile);
          loadMatches();
        }
      } catch (err) {
        if (err.status === 409) return; // server already has this swipe
        setQueue((q) => [swiped, ...q]);
        setNotice("Couldn't save that swipe. Check your connection and try again.");
      }
    },
    [top, loadMatches]
  );

  // Desktop keyboard support: ← pass, → like.
  useEffect(() => {
    if (!active || view !== "swipe" || justMatched) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") cardRef.current?.fling("like");
      if (e.key === "ArrowLeft") cardRef.current?.fling("pass");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, view, justMatched]);

  const handleReset = async () => {
    try {
      await resetDemo();
      await Promise.all([loadFeed(), loadMatches()]);
    } catch {
      setNotice("Couldn't reset the demo.");
    }
  };

  const next = queue[1];

  return (
    <div className="discover">
      <header className="d-header">
        <h1>Discover</h1>
        <div className="seg" role="tablist" aria-label="Discover views">
          <button role="tab" aria-selected={view === "swipe"} className={view === "swipe" ? "seg-on" : ""} onClick={() => setView("swipe")}>
            Swipe
          </button>
          <button role="tab" aria-selected={view === "matches"} className={view === "matches" ? "seg-on" : ""} onClick={() => setView("matches")}>
            Matches{matches.length > 0 && <span className="count">{matches.length}</span>}
          </button>
        </div>
      </header>

      {view === "matches" ? (
        <div className="d-body scroll">
          <MatchesList matches={matches} loading={matchesLoading} />
        </div>
      ) : (
        <div className="d-body">
          <div className="stage">
            {status === "loading" && <p className="muted center-text">Finding people…</p>}

            {status === "error" && (
              <div className="empty">
                <h2>Couldn&rsquo;t load profiles</h2>
                <p>Check your connection, then try again.</p>
                <button className="btn btn-solid" onClick={loadFeed}>Try again</button>
              </div>
            )}

            {status === "ready" && !top && (
              <div className="empty">
                <h2>You&rsquo;ve seen everyone for now</h2>
                <p>New people will show up here. Your matches are waiting in the Matches view.</p>
                <button className="btn btn-solid" onClick={() => setView("matches")}>View matches</button>
                <button className="btn btn-ghost" onClick={handleReset}>Reset demo data</button>
              </div>
            )}

            {top && (
              <>
                {next && (
                  <div className="card card-peek" aria-hidden="true">
                    <Photo profile={next} className="card-photo" />
                  </div>
                )}
                <SwipeCard key={top.id} ref={cardRef} profile={top} onSwiped={handleSwiped} />
              </>
            )}
          </div>

          {top && (
            <div className="actions">
              <button className="round round-pass" onClick={() => cardRef.current?.fling("pass")} aria-label="Pass">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </button>
              <button className="round round-like" onClick={() => cardRef.current?.fling("like")} aria-label="Like">
                <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                  <path
                    d="M12 21s-7.500-4.600-9.300-9.200C1.400 8.300 3.400 5 6.700 5c2 0 3.500 1.100 5.300 3 1.800-1.900 3.300-3 5.300-3 3.300 0 5.300 3.300 4 6.800C19.500 16.400 12 21 12 21z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}

      {justMatched && (
        <MatchModal
          profile={justMatched}
          onKeepSwiping={() => setJustMatched(null)}
          onSeeMatches={() => {
            setJustMatched(null);
            setView("matches");
          }}
        />
      )}
    </div>
  );
}
