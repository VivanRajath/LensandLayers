import "./styles.css";
import "./notFound.css";

/* 404 page: the lens follows the pointer, the colour layers drift apart with it,
   the timecode runs, and clicking the lens takes a (very disappointing) picture. */

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const root = document.documentElement;
const pupil = $("[data-pupil]");
const lens = $("[data-lens]");

// Pointer → lens gaze and layer drift (-1…1 from the centre of the screen)
let tx = 0, ty = 0, x = 0, y = 0;
const aim = (cx: number, cy: number) => {
  tx = (cx / window.innerWidth) * 2 - 1;
  ty = (cy / window.innerHeight) * 2 - 1;
};
window.addEventListener("pointermove", (e) => aim(e.clientX, e.clientY));
window.addEventListener("pointerleave", () => aim(window.innerWidth / 2, window.innerHeight / 2));

// With no pointer (phones), the lens wanders on its own
let lastMove = 0;
window.addEventListener("pointermove", () => (lastMove = performance.now()));

const tick = (t: number) => {
  if (t - lastMove > 2500 && !reduce) {
    tx = Math.sin(t / 1300) * 0.7;
    ty = Math.cos(t / 1700) * 0.45;
  }
  x += (tx - x) * 0.08;
  y += (ty - y) * 0.08;
  pupil.style.translate = `${x * 45}% ${y * 45}%`;
  root.style.setProperty("--dx", x.toFixed(3));
  root.style.setProperty("--dy", y.toFixed(3));
  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

// Running timecode (frames at 24 fps), starting from 00:04:04
const tc = $("[data-timecode]");
const start = performance.now();
const pad = (n: number) => String(n).padStart(2, "0");
window.setInterval(() => {
  const f = Math.floor(((performance.now() - start) / 1000) * 24) + (4 * 60 + 4) * 24;
  tc.textContent = `${pad(Math.floor(f / 86400))}:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
}, 1000 / 24);

// Focus status flickers between hunting and giving up
const status = $("[data-status]");
const states = ["Focus: lost", "Focus: hunting…", "Focus: lost", "Focus: who knows"];
let si = 0;
window.setInterval(() => (status.textContent = states[++si % states.length]), 2200);

// Shutter
const quips = [
  "Lovely shot of absolutely nothing.",
  "Still nothing here. Bold of you to keep trying.",
  "Blurry. Even our editors can't save this one.",
  "We'd retouch it, but there's nothing to retouch.",
  "That one's going straight to the outtakes.",
  "Okay, that one's art. Still not a page though.",
];
const quip = $("[data-quip]");
const shots = $("[data-shots]");
const flash = $("[data-flash]");
let count = 0;
lens.addEventListener("click", () => {
  count += 1;
  shots.textContent = String(count);
  quip.textContent = quips[(count - 1) % quips.length];
  for (const el of [lens, flash]) {
    el.classList.remove("is-snap");
    void el.offsetWidth; // restart the animation
    el.classList.add("is-snap");
  }
});
