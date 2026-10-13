import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { allServices } from "../data";

/** Closing call-to-action with expanding rings and an enquiry form. */
export default function Cta() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-ring",
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true },
        },
      );
      gsap.fromTo(
        ".cta-title .ln > span",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".cta-title", start: "top 80%", once: true } },
      );
      gsap.fromTo(
        ".cta-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".cta-title", start: "top 70%", once: true } },
      );
    },
    { scope: ref },
  );

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent(String(data.get("name") || "").split(" ")[0] || "there");
    e.currentTarget.reset();
  };

  return (
    <section className="cta" id="contact" ref={ref}>
      <div className="cta-rings" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span className="cta-ring" key={i} style={{ width: `${30 + i * 16}vmax`, height: `${30 + i * 16}vmax` }} />
        ))}
      </div>
      <div className="cta-inner">
        <h2 className="cta-title" aria-label="Ready to be seen?">
          <span className="ln"><span>Ready to</span></span>
          <span className="ln"><span>be seen?</span></span>
        </h2>
        <p className="cta-sub cta-fade">
          Tell us what you are building. No call centres, no runaround — just a creative team that comes back within one
          working day with ideas and a plan.
        </p>

        {sent ? (
          <p className="cta-thanks cta-fade" role="status">Thanks {sent} — we'll be in touch within one working day.</p>
        ) : (
          <form className="cta-form cta-fade" onSubmit={submit}>
            <input name="name" placeholder="Your name" required aria-label="Your name" />
            <input name="email" type="email" placeholder="Email address" required aria-label="Email address" />
            <select name="service" aria-label="Service" defaultValue="">
              <option value="" disabled>I'm interested in…</option>
              {allServices.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-brand">
              <span className="btn-label" data-text="Work with us">Work with us</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
