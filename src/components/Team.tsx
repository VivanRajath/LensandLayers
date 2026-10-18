import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { team, type TeamMember } from "../data";
import SplitHeading from "./SplitHeading";

const photo = (slug: string) => `${import.meta.env.BASE_URL}team/${slug}.webp`;
const bySlug = Object.fromEntries(team.map((m) => [m.slug, m])) as Record<string, TeamMember>;

/**
 * Group-photo arrangement: x = centre (% of stage width), front row is larger
 * and in front; the back row sits higher, between the front row's heads.
 */
const lineup: { slug: string; x: number; row: "front" | "back" }[] = [
  { slug: "abhishek", x: 20, row: "back" },
  { slug: "rachana", x: 40, row: "back" },
  { slug: "dushyanth", x: 60, row: "back" },
  { slug: "sharath", x: 80, row: "back" },
  { slug: "supreeth", x: 10, row: "front" },
  { slug: "deepak", x: 30, row: "front" },
  { slug: "deekshith", x: 50, row: "front" },
  { slug: "vikas", x: 70, row: "front" },
  { slug: "vivan", x: 90, row: "front" },
];


export default function Team() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mover = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const [active, setActiveState] = useState<string | null>(null);
  // Mirrors `active` synchronously so pointer-move never docks the card to a stale person.
  const activeRef = useRef<string | null>(null);
  const setActive = (slug: string | null) => {
    activeRef.current = slug;
    setActiveState(slug);
  };
  const [mobileActive, setMobileActive] = useState(team[0].slug);

  useGSAP(
    () => {
      mover.current = {
        x: gsap.quickTo(cardRef.current, "x", { duration: 0.45, ease: "power3.out" }),
        y: gsap.quickTo(cardRef.current, "y", { duration: 0.45, ease: "power3.out" }),
      };
      // People rise into frame, back row first
      gsap.fromTo(
        ".tm-person",
        { yPercent: 18, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".tm-stage", start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        ".tm-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: ref.current, start: "top 70%", once: true } },
      );
    },
    { scope: ref },
  );

  /**
   * Place the card beside the highlighted person (never over their face):
   * horizontally it docks to the person's right edge, flipping left near the
   * stage edge; vertically it follows the cursor.
   */
  const placeCard = (slug: string, py: number | null, instant = false) => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const person = stage?.querySelector<HTMLElement>(`[data-person="${slug}"]`);
    if (!stage || !card || !person || !mover.current) return;
    const r = stage.getBoundingClientRect();
    const p = person.getBoundingClientRect();
    const ch = card.offsetHeight || 220;
    const right = p.left - r.left + p.width * 0.86;
    const left = p.left - r.left + p.width * 0.14;
    let x = right + 12;
    const cw = card.offsetWidth || 340; // card scales with the root font size on large screens
    if (x + cw > stage.clientWidth) x = left - cw - 12;
    const yRaw = py ?? p.top - r.top + p.height * 0.2;
    const y = Math.min(Math.max(yRaw - ch / 2, -ch * 0.2), stage.clientHeight - ch * 0.8);
    if (instant) gsap.set(card, { x, y });
    else {
      mover.current.x(x);
      mover.current.y(y);
    }
  };

  const onMove = (e: React.PointerEvent) => {
    const current = activeRef.current;
    if (e.pointerType === "touch" || !current) return;
    placeCard(current, e.clientY - stageRef.current!.getBoundingClientRect().top);
  };

  /** Keyboard focus and the name index have no cursor over the photo. */
  const anchorTo = (slug: string, instant: boolean) => placeCard(slug, null, instant);

  const enter = (slug: string) => (e: React.PointerEvent | React.FocusEvent) => {
    const wasHidden = activeRef.current === null;
    setActive(slug);
    const py = "clientY" in e ? e.clientY - stageRef.current!.getBoundingClientRect().top : null;
    placeCard(slug, py, wasHidden);
  };

  // Mobile carousel: the tile nearest the centre is highlighted
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setMobileActive((en.target as HTMLElement).dataset.slug!)),
      { root, threshold: 0.6 },
    );
    root.querySelectorAll(".tm-tile").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const shown = active ? bySlug[active] : null;

  return (
    <section className="team" id="team" ref={ref}>
      <div className="team-head">
        <span className="mono-label tm-fade">Our team</span>
        <SplitHeading className="display" lines={["[The people]", "behind every layer"]} />
        <p className="team-sub tm-fade">
          Directors, editors, artists, analysts and writers — one in-house crew. Hover over anyone to meet them.
        </p>
      </div>

      {/* Desktop: group photo with hover spotlight + floating card */}
      <div className={`tm-stage${active ? " has-active" : ""}`} ref={stageRef} onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        <span className="tm-backdrop" aria-hidden="true">Lens&amp;Layers</span>
        {lineup.map(({ slug, x, row }) => {
          const m = bySlug[slug];
          return (
            <div
              key={slug}
              data-person={slug}
              className={`tm-person is-${row}${active === slug ? " is-active" : ""}`}
              style={{ "--x": x } as React.CSSProperties}
            >
              <img src={photo(slug)} alt="" draggable={false} loading="lazy" />
              <button
                className="tm-hit"
                data-hit={slug}
                aria-label={`${m.name}, ${m.role}`}
                onPointerEnter={enter(slug)}
                onFocus={enter(slug)}
                onBlur={() => setActive(null)}
              />
            </div>
          );
        })}
        <span className="tm-fog" aria-hidden="true" />

        <div className={`tm-card${shown ? " is-visible" : ""}`} ref={cardRef} aria-live="polite">
          <i className="dot tl" /><i className="dot tr" /><i className="dot bl" /><i className="dot br" />
          {shown && (
            <div className="tm-card-inner" key={shown.slug}>
              <div className="tm-card-top">
                <span>{shown.id}</span>
                <span>{shown.department}</span>
              </div>
              <h3 className="tm-card-name">{shown.name}</h3>
              <p className="tm-card-role">{shown.role}</p>
              <p className="tm-card-sum">{shown.summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Name index under the photo — hovering a name highlights that person too */}
      <ul className="tm-index" onPointerLeave={() => setActive(null)}>
        {team.map((m) => (
          <li key={m.slug} className={active === m.slug ? "is-active" : ""} onPointerEnter={() => { anchorTo(m.slug, activeRef.current === null); setActive(m.slug); }}>
            <span>{m.id}</span>
            <strong>{m.name}</strong>
            <em>{m.role}</em>
          </li>
        ))}
      </ul>

      {/* Mobile: swipeable tiles */}
      <div className="tm-scroller" ref={scrollerRef}>
        {team.map((m) => (
          <article key={m.slug} data-slug={m.slug} className={`tm-tile${mobileActive === m.slug ? " is-active" : ""}`}>
            <div className="tm-tile-img">
              <img src={photo(m.slug)} alt={m.name} loading="lazy" />
            </div>
            <div className="tm-tile-body">
              <span className="mono-label">{m.id} · {m.department}</span>
              <h3 className="tm-card-name">{m.name}</h3>
              <p className="tm-card-role">{m.role}</p>
              <p className="tm-card-sum">{m.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
