import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroImage, heroTaglines } from "../data";

/**
 * Sticky full-screen hero. The next section slides up over it while the
 * image slowly zooms and darkens, like the reference's curtain effect.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);

  // Intro once the loader has lifted
  useGSAP(
    () => {
      if (!ready) {
        gsap.set(".hero-title .ln > span", { yPercent: 110 });
        return;
      }
      gsap
        .timeline()
        .fromTo(".hero-img", { scale: 1.25 }, { scale: 1.05, duration: 2.2, ease: "expo.out" })
        .fromTo(".hero-title .ln > span", { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0.15)
        .fromTo(".hero-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.08 }, 0.6);
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
      gsap.to(".hero-content", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  const ticker = [...heroTaglines, ...heroTaglines];

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-media">
        <img className="hero-img" src={heroImage} alt="Photographer shooting on a city street" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-shade" />

      <div className="hero-content">
        <span className="mono-label hero-fade">Our services</span>
        <h1 className="hero-title" aria-label="Every frame, every layer, every click">
          <span className="ln is-muted"><span>Every frame.</span></span>
          <span className="ln"><span>Every layer.</span></span>
          <span className="ln"><span>Every click.</span></span>
        </h1>
      </div>

      <div className="hero-ticker hero-fade" aria-hidden="true">
        <div className="hero-ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
