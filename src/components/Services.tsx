import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { allServices, groups, introImage } from "../data";
import { useScrollTo } from "../lib/scroll";
import SplitHeading from "./SplitHeading";
import Icon from "./Icon";

type Theme = "intro" | "dark" | "light";

/** Images shown side by side before they slide together into the single sticky frame. */
const strip = [introImage, ...allServices.slice(0, 3).map((s) => ({ src: s.img, alt: s.alt }))];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The services section, rebuilt from the reference's behaviour:
 *  1. A row of horizontal images sits under the headline.
 *  2. On scroll the row slides together and collapses into ONE image that
 *     pins in place, while the layout (index left, image centre) stays fixed.
 *  3. The written content scrolls on the right. Each service's divider line
 *     cuts through the pinned image as it passes: the next image is revealed
 *     below the line, scrubbed 1:1 with the scroll.
 *  4. The section flips dark for Core Services and light for Integrated
 *     Solutions as each block slides up underneath the pinned layout.
 */
export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [theme, setTheme] = useState<Theme>("intro");
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const root = ref.current!;
      const frame = root.querySelector<HTMLElement>(".svc-frame")!;
      // Sticky frame is vertically centred; derive its viewport offsets.
      const frameTop = () => (window.innerHeight - frame.offsetHeight) / 2;
      const frameBottom = () => frameTop() + frame.offsetHeight;

      /** Keep `active` in sync with scroll: index of the last item whose top is above `lineY()`. */
      const trackActive = (items: HTMLElement[], lineY: () => number) => {
        const update = () => {
          const y = lineY();
          let idx = -1;
          for (let k = 0; k < items.length; k++) {
            if (items[k].getBoundingClientRect().top <= y) idx = k;
            else break;
          }
          setActive((cur) => (cur === idx ? cur : idx));
        };
        ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: update, onRefresh: update, onToggle: update });
        update();
      };

      // Theme per group (runs on every breakpoint)
      gsap.utils.toArray<HTMLElement>(".svc-group", root).forEach((g, i) => {
        const t = g.dataset.theme as Theme;
        ScrollTrigger.create({
          trigger: g,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setTheme(t),
          onEnterBack: () => setTheme(t),
          onLeaveBack: () => i === 0 && setTheme("intro"),
        });
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".svc-item", root);
        const layers = gsap.utils.toArray<HTMLElement>(".svc-layer[data-i]", root);

        // 1–2. Collapse the horizontal strip into the pinned frame
        const collapse = gsap.timeline({
          scrollTrigger: {
            trigger: ".svc-body",
            start: () => `top ${frameTop()}px`,
            end: () => `+=${window.innerHeight * 0.65}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        collapse
          .to(".svc-strip-item", {
            x: (_, el: HTMLElement) => -el.offsetLeft,
            ease: "power2.inOut",
            stagger: { each: 0.03, from: "end" },
            duration: 1,
          })
          .to(".svc-strip-item", { opacity: 0, duration: 0.1 }, ">-0.05")
          .fromTo(".svc-lead", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.25)
          .fromTo(".svc-meta", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);

        // 3. Each divider line reveals the next image beneath it
        items.forEach((item, i) => {
          const layer = layers[i];
          const img = layer.querySelector("img");
          const st = {
            trigger: item,
            start: () => `top ${frameBottom()}px`,
            end: () => `top ${frameTop()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          };
          gsap.fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
          gsap.fromTo(img, { scale: 1.18, yPercent: 6 }, { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { ...st } });

        });

        // Active = the last service whose divider has passed the top of the frame. Derived from
        // positions on every scroll update (not per-item enter/leave events), so fast flicks or
        // jumping via the index can never leave it stale.
        trackActive(items, () => frameTop() + 2);

        // Index fades in when the first group arrives
        gsap.fromTo(
          ".svc-index-row",
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: ".svc-group", start: "top 75%", toggleActions: "play none none reverse" },
          },
        );
      });

      mm.add("(max-width: 991px)", () => {
        gsap.utils.toArray<HTMLElement>(".svc-item", root).forEach((item) => {
          gsap.fromTo(
            item.querySelector(".svc-item-media-inner"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", scrollTrigger: { trigger: item, start: "top 80%", once: true } },
          );
        });
        trackActive(gsap.utils.toArray<HTMLElement>(".svc-item", root), () => window.innerHeight * 0.6);
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  const frameTopPx = () => {
    const f = ref.current?.querySelector<HTMLElement>(".svc-frame");
    return f ? (window.innerHeight - f.offsetHeight) / 2 : 120;
  };
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) scrollTo(el, -frameTopPx() + 4);
  };

  const current = active >= 0 ? allServices[active] : null;
  let n = 0;

  return (
    <section className="svc" id="services" ref={ref} data-theme={theme}>
      <div className="svc-intro">
        <span className="mono-label">Our services</span>
        <SplitHeading className="display" lines={["[Integrated]", "creative for brands", "that want to be seen"]} />
      </div>

      <div className="svc-body">
        {/* Left: lead copy, then the sticky service index */}
        <aside className="svc-left">
          <p className="svc-lead">
            We plan, shoot, edit, publish and promote — one connected team for strategy, content and growth, so
            every layer of your brand works together across search, social and screen.
          </p>
          <div className="svc-index-sticky">
            <nav className="svc-index" aria-label="Services">
              {groups.map((g) => (
                <div className="svc-index-group" key={g.id}>
                  <span className="svc-index-label svc-index-row">{g.label}</span>
                  <ul>
                    {g.items.map((s) => {
                      const idx = n++;
                      return (
                        <li key={s.id} className="svc-index-row">
                          <a href={`#${s.id}`} onClick={jump(s.id)} className={idx === active ? "is-active" : ""}>
                            <span>{s.name}</span>
                            <span>{pad(idx + 1)}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Centre: the pinned frame */}
        <div className="svc-media" aria-hidden="true">
          <span className="svc-ruler" />
          <div className="svc-media-sticky">
            <div className="svc-stage">
              <div className="svc-strip">
                {strip.slice(1).map((s, i) => (
                  <div className="svc-strip-item" key={i} style={{ left: `calc(${i + 1} * (var(--frame-w) + var(--strip-gap)))` }}>
                    <img src={s.src} alt="" />
                  </div>
                ))}
              </div>
              <div className="svc-frame">
                <div className="svc-layer is-base">
                  <img src={strip[0].src} alt="" />
                </div>
                {allServices.map((s, i) => (
                  <div className="svc-layer" data-i={i} key={s.id}>
                    <img src={s.img} alt="" />
                  </div>
                ))}
                <i className="dot tl" /><i className="dot tr" /><i className="dot bl" /><i className="dot br" />
              </div>
              <div className="svc-meta">
                <span>{current ? pad(active + 1) : "00"} / {pad(allServices.length)}</span>
                <span className="svc-meta-name">{current ? current.name : "Lens & Layers"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: the written content that scrolls past the fixed layout */}
        <div className="svc-content">
          <div className="svc-spacer" />
          {groups.map((g) => (
            <div className="svc-group" data-theme={g.theme} key={g.id}>
              <span className="svc-group-label mono-label">{g.label}</span>
              {g.items.map((s) => {
                const idx = allServices.findIndex((a) => a.id === s.id);
                return (
                  <article className={`svc-item${idx === active ? " is-active" : ""}`} id={s.id} key={s.id}>
                    <span className="svc-item-line" />
                    <div className="svc-item-media">
                      <div className="svc-item-media-inner">
                        <img src={s.img} alt={s.alt} loading="lazy" />
                      </div>
                    </div>
                    <div className="svc-item-inner">
                      <div className="svc-item-head">
                        <div>
                          <span className="svc-item-num mono-label">{pad(idx + 1)}</span>
                          <h3 className="svc-item-title">{s.name}</h3>
                          <p className="svc-item-tag">{s.tagline}</p>
                        </div>
                        <Icon name={s.icon} />
                      </div>
                      <div className="svc-item-body">
                        <div className="svc-item-copy">
                          {s.body.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                        <a href="#contact" className="btn btn-pill svc-item-btn" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>
                          <span className="btn-label" data-text={s.cta}>{s.cta}</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
