import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./admin.css";
import { team, profileUrl, type TeamMember } from "./team";
import { renderIdCard, saveFile, idCardFilename } from "./lib/idCard";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const qrFile = (m: TeamMember, ext: "png" | "svg") => `lens-and-layers-${m.slug}-qr.${ext}`;

/** ID cards are drawn once on load; the previews double as the files that get downloaded. */
function useIdCards() {
  const [cards, setCards] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    const urls: string[] = [];
    (async () => {
      for (const m of team) {
        try {
          const url = URL.createObjectURL(await renderIdCard(m));
          urls.push(url);
          if (alive) setCards((c) => ({ ...c, [m.slug]: url }));
        } catch (err) {
          console.error(`ID card for ${m.slug} failed:`, err);
        }
      }
    })();
    return () => {
      alive = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);
  return cards;
}

function Admin() {
  const cards = useIdCards();
  const ready = Object.keys(cards).length === team.length;

  /** Browsers may ask once to allow several downloads from this page. */
  const downloadAll = async (kind: "cards" | "qr") => {
    for (const m of team) {
      if (kind === "cards") saveFile(cards[m.slug], idCardFilename(m));
      else saveFile(asset(`qr/${m.slug}.png`), qrFile(m, "png"));
      await new Promise((r) => setTimeout(r, 350));
    }
  };

  return (
    <>
      <header className="ad-head">
        <a href="/" aria-label="Lens & Layers home">
          <img className="logo" src={asset("brand/logo-light.webp")} alt="Lens & Layers Digital Solutions" width={1032} height={151} />
        </a>
        <span className="ad-badge mono-label">Internal · Not linked</span>
      </header>

      <main className="ad-main">
        <section className="ad-intro">
          <span className="mono-label">Team kit</span>
          <h1 className="ad-title">QR codes &amp; ID cards</h1>
          <p>
            Every code opens that person's page on lensandlayers.in. ID cards print at 54 × 85.6 mm (standard card size).
            This page isn't linked anywhere and search engines are told to skip it, so share its address only with the team admins.
          </p>
          <div className="ad-all">
            <button type="button" className="btn btn-brand" onClick={() => downloadAll("cards")} disabled={!ready}>
              <span className="btn-label" data-text={ready ? "All ID cards" : "Preparing cards…"}>{ready ? "All ID cards" : "Preparing cards…"}</span>
            </button>
            <button type="button" className="btn btn-pill ad-ghost" onClick={() => downloadAll("qr")}>
              <span className="btn-label" data-text="All QR codes">All QR codes</span>
            </button>
          </div>
        </section>

        <ul className="ad-grid">
          {team.map((m) => {
            const card = cards[m.slug];
            return (
              <li key={m.slug} className="ad-item">
                <div className={`ad-card${card ? " is-ready" : ""}`}>
                  {card ? <img src={card} alt={`${m.name}'s ID card`} width={1080} height={1712} /> : <span className="ad-loading mono-label">Drawing card…</span>}
                </div>
                <div className="ad-meta">
                  <span className="mono-label">{m.id}</span>
                  <strong>{m.name}</strong>
                  <em>{m.role}</em>
                  <a className="ad-link" href={profileUrl(m.slug)} target="_blank" rel="noopener">
                    {profileUrl(m.slug).replace(/^https?:\/\//, "")} ↗
                  </a>
                </div>
                <div className="ad-actions">
                  <button type="button" className="ad-btn is-primary" disabled={!card} onClick={() => saveFile(card, idCardFilename(m))}>
                    ID card · PNG
                  </button>
                  <button type="button" className="ad-btn" onClick={() => saveFile(asset(`qr/${m.slug}.png`), qrFile(m, "png"))}>
                    QR · PNG
                  </button>
                  <button type="button" className="ad-btn" onClick={() => saveFile(asset(`qr/${m.slug}.svg`), qrFile(m, "svg"))}>
                    QR · SVG
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Admin />
  </StrictMode>,
);
