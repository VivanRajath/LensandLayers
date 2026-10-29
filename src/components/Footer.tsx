import { useState } from "react";
import { groups, industries, socialLinks, studioAddress, whatsappUrl } from "../data";
import { Logo } from "./Header";
import { useScrollTo } from "../lib/scroll";

const socials = [
  { label: "Instagram", href: socialLinks.instagram, d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8a4 4 0 1 0 0-8zm5.5-1.5h.01" },
  { label: "LinkedIn", href: socialLinks.linkedin, d: "M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 9h4v1.6c.6-1 1.8-1.9 3.6-1.9 3.2 0 3.9 2.1 3.9 4.8V20h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-4z" },
  { label: "WhatsApp", href: whatsappUrl, d: "M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.8.8.8-2.7-.2-.3A7.7 7.7 0 0 1 12 4.3zM8.9 7.6c-.2 0-.5 0-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5 0 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4l-2-.9c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.5z" },
  { label: "YouTube", href: socialLinks.youtube, d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" },
];

export default function Footer() {
  const [tab, setTab] = useState<"industries" | "services">("industries");
  const scrollTo = useScrollTo();
  const words = tab === "industries" ? industries : groups.flatMap((g) => g.items.map((s) => s.name));
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Logo tone="dark" />
          <p>One studio.<br />Every layer of your brand.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <span className="mono-label">Socials</span>
            <div className="footer-social">
              {socials.filter((s) => s.label !== "WhatsApp" || s.href).map((s) => (
                <a
                  key={s.label}
                  href={s.href || "#"}
                  aria-label={s.label}
                  {...(s.href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <svg viewBox="0 0 24 24"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <span className="mono-label">Company</span>
            <div className="footer-links">
              <a href="#top" onClick={go("#top")}>Home</a>
              <a href="#studio" onClick={go("#studio")}>Studio</a>
              <a href="#services" onClick={go("#services")} className="is-current">Services</a>
              <a href="#">About us</a>
              <a href="#">Careers</a>
              <a href="#contact" onClick={go("#contact")}>Contact us</a>
            </div>
          </div>
          <div className="footer-col">
            <span className="mono-label">Contact</span>
            <a href="mailto:hello@lensandlayers.com">hello@lensandlayers.com</a>
            <a href="tel:+910000000000">+91 00000 00000</a>
            <p>Mon – Sat · 10:00 AM – 7:00 PM</p>
            <a href={studioAddress.maps} target="_blank" rel="noopener noreferrer" className="footer-address">
              {studioAddress.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-marquee">
        <div className="footer-tabs" role="tablist">
          {(["industries", "services"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
              {t === "industries" ? "Industries" : "Services"}
            </button>
          ))}
        </div>
        <div className="footer-track-wrap" aria-hidden="true">
          <div className="footer-track" key={tab}>
            {[...words, ...words].map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bot">
        <span>© {new Date().getFullYear()} Lens &amp; Layers. All rights reserved.</span>
        <div>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
