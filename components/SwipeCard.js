"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Photo from "./Photo";

const THRESHOLD = 110; // px dragged before a release counts as a swipe
const VELOCITY = 600; // px/s flick that also counts
const FLY_DISTANCE = 560;

// Draggable top card. Parent can trigger a swipe through ref.fling("like" | "pass")
// so buttons and keyboard share the exact same animation + callback path.
const SwipeCard = forwardRef(function SwipeCard({ profile, onSwiped }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-13, 0, 13]);
  const likeOpacity = useTransform(x, [24, THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-THRESHOLD, -24], [1, 0]);
  const reduceMotion = useReducedMotion();
  const flying = useRef(false);

  const fling = (direction) => {
    if (flying.current) return;
    flying.current = true;
    animate(x, direction === "like" ? FLY_DISTANCE : -FLY_DISTANCE, {
      duration: reduceMotion ? 0.01 : 0.28,
      ease: "easeIn",
      onComplete: () => onSwiped(direction),
    });
  };

  useImperativeHandle(ref, () => ({ fling }), [onSwiped, reduceMotion]);

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    if (offset.x > THRESHOLD || velocity.x > VELOCITY) fling("like");
    else if (offset.x < -THRESHOLD || velocity.x < -VELOCITY) fling("pass");
    else animate(x, 0, { type: "spring", stiffness: 500, damping: 32 });
  };

  return (
    <motion.article
      className="card"
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.9}
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <Photo profile={profile} className="card-photo" />

      <motion.div className="stamp stamp-like" style={{ opacity: likeOpacity }} aria-hidden="true">
        Like
      </motion.div>
      <motion.div className="stamp stamp-pass" style={{ opacity: passOpacity }} aria-hidden="true">
        Pass
      </motion.div>

      <div className="card-info">
        <h2>
          {profile.name} <span className="age">{profile.age}</span>
        </h2>
        <p className="place">{profile.place}</p>
        <p className="bio">{profile.bio}</p>
        <ul className="chips">
          {profile.interests.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
});

export default SwipeCard;
