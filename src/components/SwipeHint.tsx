import { useEffect, useState, type RefObject } from "react";
import { SWIPE_PATH } from "../lib/glyphs";

/**
 * "Swipe" cue above a sideways-scrolling row on touch screens. Fades out once the row has
 * been swiped. Hidden by default; each row's stylesheet shows it at the widths where it scrolls.
 */
export default function SwipeHint({ target, label = "Swipe" }: { target: RefObject<HTMLElement | null>; label?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const onScroll = () => el.scrollLeft > 24 && setDone(true);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [target]);
  return (
    <div className={`swipe-hint${done ? " is-done" : ""}`} aria-hidden="true">
      <svg viewBox="0 -960 960 960"><path d={SWIPE_PATH} /></svg>
      <span>{label}</span>
    </div>
  );
}
