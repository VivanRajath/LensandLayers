import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { groups, nav } from "../data";
import { useLenis, useScrollTo } from "../lib/scroll";

export function Logo() {
  return (
    <span className="logo">
      <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="20" cy="20" r="7.5" fill="currentColor" />
        <path d="M20 2v10M38 20H28M20 38V28M2 20h10" stroke="currentColor" strokeWidth="2.4" />
      </svg>
      <span className="logo-text">LENS&amp;LAYERS</span>
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll, direction }: { scroll: number; direction: number }) =>
      setHidden(scroll > 200 && direction === 1);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .fromTo(menuRef.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
        .fromTo(".menu-link span", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "-=0.35")
        .fromTo(".menu-fade", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.04 }, "<0.1");
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (open) {
      tl.current?.timeScale(1).play();
      lenis?.stop();
    } else {
      tl.current?.timeScale(1.6).reverse();
      lenis?.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollTo(href), open ? 450 : 0);
  };

  return (
    <header className={`header${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <div className="header-bar">
        <a href="#top" className="header-logo" onClick={go("#top")} aria-label="Lens & Layers home">
          <Logo />
        </a>
        <nav className="header-nav" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.label} href={n.href} onClick={go(n.href)} className="header-link">
              <span data-text={n.label}>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="header-act">
          <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="site-menu">
            <span className="menu-btn-dots"><i /><i /><i /><i /></span>
            <span className="menu-btn-text">
              <span>Menu</span>
              <span>Close</span>
            </span>
          </button>
          <a href="#contact" onClick={go("#contact")} className="btn btn-brand header-cta">
            <span className="btn-label" data-text="Work with us">Work with us</span>
          </a>
        </div>
      </div>

      <div className="menu-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="menu" id="site-menu" ref={menuRef} aria-hidden={!open}>
        <div className="menu-grid">
          <div className="menu-main">
            <span className="mono-label menu-fade">Navigate</span>
            {nav.map((n, i) => (
              <a key={n.label + i} href={n.href} onClick={go(n.href)} className="menu-link">
                <span>
                  <em>0{i + 1}</em>
                  {n.label}
                </span>
              </a>
            ))}
          </div>
          <div className="menu-side">
            <span className="mono-label menu-fade">Services</span>
            {groups[0].items.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={go(`#${s.id}`)} className="menu-sub menu-fade">
                {s.name}
              </a>
            ))}
          </div>
          <div className="menu-side">
            <span className="mono-label menu-fade">Say hello</span>
            <a href="mailto:hello@lensandlayers.com" className="menu-sub menu-fade">hello@lensandlayers.com</a>
            <a href="tel:+910000000000" className="menu-sub menu-fade">+91 00000 00000</a>
            <div className="menu-social menu-fade">
              <a href="#" className="dot-link">Instagram</a>
              <a href="#" className="dot-link">LinkedIn</a>
              <a href="#" className="dot-link">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
