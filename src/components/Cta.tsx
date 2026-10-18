import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { allServices } from "../data";
import { sendEnquiry } from "../lib/contact";

/** Closing call-to-action with expanding rings and an enquiry form. */
export default function Cta() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const first = String(new FormData(form).get("name") || "").trim().split(/\s+/)[0] || "there";
    setStatus("sending");
    setError(null);
    try {
      await sendEnquiry(form);
      form.reset();
      setSent(first);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
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
          <div className="cta-thanks" role="status">
            <strong>Thank you, {sent}.</strong>
            <span>We've emailed you a confirmation — our team will get in touch within one working day.</span>
          </div>
        ) : (
          <form className="cta-form cta-fade" onSubmit={submit} aria-busy={status === "sending"}>
            <input name="name" placeholder="Your name" required maxLength={120} autoComplete="name" aria-label="Your name" />
            <input name="email" type="email" placeholder="Email address" required maxLength={160} autoComplete="email" aria-label="Email address" />
            <input name="phone" type="tel" placeholder="Phone (optional)" maxLength={40} autoComplete="tel" aria-label="Phone number" />
            <select name="service" aria-label="Service" defaultValue="" required>
              <option value="" disabled>I'm interested in…</option>
              {allServices.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
              <option>Something else</option>
            </select>
            <textarea name="message" placeholder="Tell us about your project (optional)" rows={3} maxLength={3000} aria-label="Message" />
            {/* Honeypot for bots — hidden from people and screen readers */}
            <input name="website" tabIndex={-1} autoComplete="off" className="cta-hp" aria-hidden="true" />
            <button type="submit" className="btn btn-brand cta-submit" disabled={status === "sending"}>
              <span className="btn-label" data-text={status === "sending" ? "Sending…" : "Work with us"}>
                {status === "sending" ? "Sending…" : "Work with us"}
              </span>
            </button>
          </form>
        )}
        {error && <p className="cta-error" role="alert">{error}</p>}
      </div>
    </section>
  );
}
