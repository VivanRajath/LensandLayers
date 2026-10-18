import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { studio } from "../data";
import SplitHeading from "./SplitHeading";

export default function Studio() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".studio-card").forEach((card) => {
        const img = card.querySelector(".studio-img img");
        gsap.fromTo(
          card.querySelector(".studio-img-inner"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: card, start: "top 80%", once: true } },
        );
        gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(
          card.querySelectorAll(".studio-fade"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: card, start: "top 70%", once: true } },
        );
      });
      gsap.fromTo(".studio-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: ".studio-sub", start: "top 90%", once: true } });
    },
    { scope: ref },
  );

  return (
    <section className="studio" id="studio" ref={ref}>
      <div className="studio-head">
        <SplitHeading className="display center" lines={["[Creative by design.]", "Data-driven by default.", "Built to convert."]} />
        <p className="studio-sub">
          Every campaign at Lens &amp; Layers runs through two integrated engines: a dedicated production studio
          capturing high-impact visual stories, and a digital performance lab engineering measurable business growth.
        </p>
      </div>

      <div className="studio-grid">
        <span className="studio-guide g1" />
        <span className="studio-guide g2" />
        <span className="studio-guide g3" />
        {studio.map((s) => (
          <article className="studio-card" key={s.num}>
            <div className="studio-img">
              <i className="dot tl" /><i className="dot tr" /><i className="dot bl" /><i className="dot br" />
              <div className="studio-img-inner">
                <img src={s.img} alt={s.alt} loading="lazy" />
              </div>
            </div>
            <div className="studio-body">
              <span className="mono-label studio-fade">{s.num} — {s.kicker}</span>
              <h3 className="studio-title studio-fade">{s.title}</h3>
              <p className="studio-fade">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
