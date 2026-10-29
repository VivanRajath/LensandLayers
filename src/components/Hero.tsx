import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroImage } from "../data";
import { useScrollTo } from "../lib/scroll";

/**
 * Sticky full-screen hero. The artwork carries its own headline, so nothing is laid over it.
 * The next section slides up over it while the image drifts and darkens.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  // Intro once the loader has lifted
  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(".hero-img", { scale: 1.12, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 2.2, ease: "expo.out" });
    },
    { scope: ref, dependencies: [ready] },
  );

  // Scroll-linked: as the studio section covers the hero
  useGSAP(
    () => {
      gsap.to(".hero-media", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-shade", {
        opacity: 0.75,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section className="hero" id="top" ref={ref}>
      <h1 className="sr-only">Lens &amp; Layers: expand your brand digitally with us</h1>
      <div className="hero-media">
        <picture>
          {/* Tall phone screens get the 4:3 cut, shown whole so the headline in the artwork isn't cropped */}
          <source media="(max-aspect-ratio: 4/5) and (max-width: 600px)" srcSet={heroImage.compact} />
          <img className="hero-img" src={heroImage.src} srcSet={heroImage.srcSet} sizes="(max-aspect-ratio: 1/1) 170vw, 100vw" alt={heroImage.alt} fetchPriority="high" />
        </picture>
      </div>
      <div className="hero-shade" />

      {/* Phones and upright tablets: cue that the page continues below the artwork */}
      <button type="button" className={`hero-scroll${ready ? " is-in" : ""}`} onClick={() => scrollTo("#studio")}>
        <span>Scroll down</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
