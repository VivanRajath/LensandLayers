import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./member.css";
import { team, profileUrl, type TeamMember } from "./team";
import SwipeHint from "./components/SwipeHint";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const photo = (slug: string) => asset(`team/${slug}.webp`);

/** The build stamps the slug on #root; the URL path is the fallback. */
const root = document.getElementById("root")!;
const slug = (root.dataset.slug?.startsWith("__") ? "" : root.dataset.slug) || location.pathname.replace(/^\/|\/$/g, "");
const member = team.find((m) => m.slug === slug);

/** Native share sheet on phones; copies the link everywhere else. */
function ShareButton({ m }: { m: TeamMember }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = profileUrl(m.slug);
    if (navigator.share) {
      try {
        await navigator.share({ title: `${m.name} · Lens & Layers`, url });
      } catch {
        // Closing the share sheet rejects; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };
  const label = copied ? "Link copied" : "Share profile";
  return (
    <button type="button" className="btn btn-pill mp-share" onClick={share} aria-live="polite">
      <span className="btn-label" data-text={label}>{label}</span>
    </button>
  );
}

function MemberPage({ m }: { m: TeamMember }) {
  const first = m.name.split(" ")[0];
  const longestWord = Math.max(...m.name.split(" ").map((w) => w.length));
  const others = team.filter((o) => o.slug !== m.slug);
  const crewRef = useRef<HTMLUListElement>(null);
  const work = `Work with ${first}`;

  return (
    <>
      <header className="mp-head">
        <a href="/" aria-label="Lens & Layers home">
          <img className="logo" src={asset("brand/logo-light.webp")} alt="Lens & Layers Digital Solutions" width={1032} height={151} />
        </a>
        <a className="dot-link" href="/#team">
          <span><span className="mp-back-long">Back to the </span>Team</span>
        </a>
      </header>

      <main>
        <section className="mp-hero" style={{ "--len": first.length } as React.CSSProperties}>
          <span className="mp-ghost" aria-hidden="true">{first}</span>

          <div className="mp-visual">
            <img src={photo(m.slug)} alt={m.name} width={720} height={1000} />
          </div>

          <div className="mp-info">
            <div className="mp-meta mono-label mp-in" style={{ "--d": 1 } as React.CSSProperties}>
              <span>{m.id}</span>
              <span>{m.department}</span>
            </div>
            <h1 className="mp-name mp-in" style={{ "--d": 2, "--word": longestWord } as React.CSSProperties}>{m.name}</h1>
            <p className="mp-role mp-in" style={{ "--d": 3 } as React.CSSProperties}>{m.role}</p>
            <p className="mp-sum mp-in" style={{ "--d": 4 } as React.CSSProperties}>{m.summary}</p>

            <div className="mp-focus mp-in" style={{ "--d": 5 } as React.CSSProperties}>
              <span className="mono-label">Focus areas</span>
              <ul>
                {m.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="mp-actions mp-in" style={{ "--d": 6 } as React.CSSProperties}>
              <a className="btn btn-brand" href="/#contact">
                <span className="btn-label" data-text={work}>{work}</span>
              </a>
              <ShareButton m={m} />
            </div>
          </div>
        </section>

        <section className="mp-crew" aria-labelledby="mp-crew-title">
          <div className="mp-crew-head">
            <h2 id="mp-crew-title" className="mono-label">The rest of the crew</h2>
            <a className="dot-link" href="/#team">Whole team</a>
          </div>
          <SwipeHint target={crewRef} />
          <ul className="mp-crew-list" ref={crewRef}>
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`/${o.slug}`}>
                  <span className="mp-crew-img">
                    <img src={photo(o.slug)} alt="" width={720} height={1000} loading="lazy" />
                  </span>
                  <span className="mono-label">{o.id}</span>
                  <strong>{o.name}</strong>
                  <em>{o.role}</em>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mp-foot">
        <span>© {new Date().getFullYear()} Lens &amp; Layers Digital Solutions</span>
        <nav>
          <a href="/">Home</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </footer>
    </>
  );
}

function NotFound() {
  return (
    <main className="mp-missing">
      <span className="mono-label">404</span>
      <h1 className="mp-name">Nobody here</h1>
      <a className="dot-link" href="/#team">Meet the team</a>
    </main>
  );
}

createRoot(root).render(<StrictMode>{member ? <MemberPage m={member} /> : <NotFound />}</StrictMode>);
