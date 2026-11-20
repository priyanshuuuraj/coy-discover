"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Photo from "./Photo";

export default function MatchModal({ profile, onKeepSwiping, onSeeMatches }) {
  const primary = useRef(null);

  useEffect(() => {
    primary.current?.focus();
    const onKey = (e) => e.key === "Escape" && onKeepSwiping();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKeepSwiping]);

  return (
    <motion.div
      className="match-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="match-faces">
        <motion.div
          className="match-face"
          initial={{ x: -140, rotate: -20, opacity: 0 }}
          animate={{ x: 14, rotate: -8, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 }}
        >
          <div className="photo you">
            <span className="photo-initial">You</span>
          </div>
        </motion.div>
        <motion.div
          className="match-face"
          initial={{ x: 140, rotate: 20, opacity: 0 }}
          animate={{ x: -14, rotate: 8, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 }}
        >
          <Photo profile={profile} />
        </motion.div>
      </div>

      <motion.h2
        id="match-title"
        className="match-title"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.35 }}
      >
        It&rsquo;s a match!
      </motion.h2>
      <p className="match-sub">You and {profile.name} liked each other.</p>

      <div className="match-actions">
        <button ref={primary} className="btn btn-solid" onClick={onSeeMatches}>
          See matches
        </button>
        <button className="btn btn-ghost" onClick={onKeepSwiping}>
          Keep swiping
        </button>
      </div>
    </motion.div>
  );
}
