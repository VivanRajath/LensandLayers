import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { allServices } from "../data";
import { sendEnquiry, type Enquiry } from "../lib/contact";
import ServiceSelect from "./ServiceSelect";

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

const SERVICE_OPTIONS = [...allServices.map((s) => s.name), "Something else"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const steps = [
  { n: "01", t: "We reply within one working day", d: "A real person from the team, not an auto-responder." },
  { n: "02", t: "A short discovery call", d: "Your goals, audience and timeline in 20 minutes." },
  { n: "03", t: "Ideas, plan & quote", d: "A clear proposal with deliverables and pricing." },
];

/** Closing call-to-action: contact details on the left, enquiry form on the right. */
export default function Cta() {
  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [sentTo, setSentTo] = useState<{ name: string; email: string } | null>(null);

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
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".cta-title", start: "top 70%", once: true } },
      );
    },
    { scope: ref },
  );


  const validate = (f: Enquiry): Errors => {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Please tell us your name.";
    if (!f.email.trim()) e.email = "We need an email to reply to.";
    else if (!EMAIL_RE.test(f.email.trim())) e.email = "That email doesn't look right.";
    if (f.phone && f.phone.replace(/[^\d]/g, "").length < 7) e.phone = "Please check the phone number.";
    return e;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Enquiry = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      service: services.join(", "),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };
    const found = validate(data);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await sendEnquiry(data);
      setSentTo({ name: data.name.trim().split(/\s+/)[0], email: data.email.trim() });
      setStatus("sent");
      form.reset();
      setServices([]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  /** Clear a field's error as soon as the visitor edits it. */
  const clearError = (name: keyof Errors) => () => errors[name] && setErrors((cur) => ({ ...cur, [name]: undefined }));

  const field = (name: "name" | "email" | "phone" | "company", label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const err = name !== "company" ? errors[name] : undefined;
    return (
      <div className={`cf-field${err ? " has-error" : ""}`}>
        <input
          id={`cf-${name}`}
          name={name}
          placeholder=" "
          aria-invalid={!!err}
          aria-describedby={err ? `cf-${name}-err` : undefined}
          onInput={name !== "company" ? clearError(name) : undefined}
          {...props}
        />
        <label htmlFor={`cf-${name}`}>{label}</label>
        <span className="cf-line" />
        {err && <span className="cf-err" id={`cf-${name}-err`}>{err}</span>}
      </div>
    );
  };

  return (
    <section className="cta" id="contact" ref={ref}>
      <div className="cta-rings" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span className="cta-ring" key={i} style={{ width: `${30 + i * 16}vmax`, height: `${30 + i * 16}vmax` }} />
        ))}
      </div>

      <div className="cta-grid">
        {/* Left: pitch + direct contact */}
        <div className="cta-info">
          <span className="mono-label cta-fade">Contact</span>
          <h2 className="cta-title" aria-label="Ready to be seen?">
            <span className="ln"><span>Ready to</span></span>
            <span className="ln"><span>be seen?</span></span>
          </h2>
          <p className="cta-sub cta-fade">
            Tell us what you're building. No call centres, no runaround — just a creative team that comes back with ideas
            and a plan.
          </p>

          <dl className="cta-direct cta-fade">
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:hello@lensandlayers.com">hello@lensandlayers.com</a></dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a href="tel:+910000000000">+91 00000 00000</a></dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>Mon – Sat · 10:00 AM – 7:00 PM</dd>
            </div>
          </dl>

          <ol className="cta-steps cta-fade" aria-label="What happens next">
            {steps.map((s) => (
              <li key={s.n}>
                <span>{s.n}</span>
                <div>
                  <strong>{s.t}</strong>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: the form */}
        <div className="cf-panel cta-fade">
          <i className="dot tl" /><i className="dot tr" /><i className="dot bl" /><i className="dot br" />

          {status === "sent" && sentTo ? (
            <div className="cf-done" role="status">
              <svg className="cf-check" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" />
                <path d="M19 33l9 9 17-19" />
              </svg>
              <h3>Thank you, {sentTo.name}.</h3>
              <p>
                Your enquiry is in. We've sent a confirmation to <strong>{sentTo.email}</strong> — our team will get in
                touch within one working day.
              </p>
              <button type="button" className="cf-again" onClick={() => setStatus("idle")}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form ref={formRef} className="cf-form" onSubmit={submit} noValidate aria-busy={status === "sending"}>
              <div className="cf-head">
                <span className="mono-label">New enquiry</span>
                <span className="mono-label cf-req">* required</span>
              </div>

              <div className="cf-row">
                {field("name", "Your name *", { autoComplete: "name", maxLength: 120 })}
                {field("email", "Email address *", { type: "email", autoComplete: "email", maxLength: 160, inputMode: "email" })}
              </div>
              <div className="cf-row">
                {field("phone", "Phone", { type: "tel", autoComplete: "tel", maxLength: 40, inputMode: "tel" })}
                {field("company", "Company / brand", { autoComplete: "organization", maxLength: 120 })}
              </div>

              <ServiceSelect label="What can we help with?" options={SERVICE_OPTIONS} value={services} onChange={setServices} />

              <div className="cf-field cf-field-area">
                <textarea id="cf-message" name="message" placeholder=" " rows={4} maxLength={3000} />
                <label htmlFor="cf-message">Tell us about your project</label>
                <span className="cf-line" />
              </div>

              {/* Honeypot for bots — hidden from people and screen readers */}
              <input name="website" tabIndex={-1} autoComplete="off" className="cf-hp" aria-hidden="true" />

              <div className="cf-foot">
                <p className="cf-note">We'll only use your details to reply to this enquiry.</p>
                <button type="submit" className="cf-submit" disabled={status === "sending"}>
                  <span>{status === "sending" ? "Sending" : "Send enquiry"}</span>
                  {status === "sending" ? (
                    <i className="cf-spin" aria-hidden="true" />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  )}
                </button>
              </div>
              {formError && <p className="cf-form-err" role="alert">{formError}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
