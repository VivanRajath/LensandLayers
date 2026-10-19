import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Logo } from "./Header";

/** Short labels so each fits on one line of the loader. */
const names = ["Digital Marketing", "SEO", "Social Media", "Product Photography", "Video Editing", "Graphic Design"];

/** Intro screen: service names flick past with a counter, then the panel lifts away. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const count = { v: 0 };
      const counter = ref.current!.querySelector(".loader-count")!;
      const tl = gsap.timeline({ onComplete: onDone });
      document.documentElement.classList.add("is-loading");

      tl.to(count, {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => (counter.textContent = String(Math.round(count.v)).padStart(3, "0")),
      })
        .to(".loader-list", { yPercent: -(100 / names.length) * (names.length - 1), duration: 1.9, ease: `steps(${names.length - 1})` }, 0)
        .to(".loader-bar i", { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
        .to(".loader-inner", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
        .to(ref.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.9,
          ease: "expo.inOut",
          onStart: () => document.documentElement.classList.remove("is-loading"),
        }, "-=0.1")
        .set(ref.current, { display: "none" });
    },
    { scope: ref },
  );

  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-brand"><Logo /></span>
        <div className="loader-window">
          <ul className="loader-list">
            {names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="loader-foot">
          <span className="loader-bar"><i /></span>
          <span className="loader-count">000</span>
        </div>
      </div>
    </div>
  );
}
