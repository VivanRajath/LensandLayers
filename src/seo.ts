/**
 * Markup for search engines, written into the HTML at build time by vite.config.ts:
 * - business and person details as schema.org JSON-LD (what Google shows in rich results and Maps)
 * - a plain-HTML copy of each page's text inside #root, so crawlers that don't run JavaScript
 *   (Bing, DuckDuckGo, AI search, link previews) still read the content. React replaces it on load.
 * - sitemap.xml
 * Everything comes from src/data.ts and src/team.ts, so editing those keeps it in step.
 */
import { contact, groups, industries, socialLinks, studio, studioAddress } from "./data";
import { team, profileUrl, SITE, type TeamMember } from "./team";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** JSON inside <script> must not be able to close the tag. */
const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const ORG_ID = `${SITE}/#business`;

export function businessJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "Lens & Layers Digital Solutions",
    alternateName: "Lens & Layers",
    url: `${SITE}/`,
    logo: `${SITE}/icon-512.png`,
    image: `${SITE}/og-image.png`,
    description:
      "Creative and digital marketing agency in Bengaluru with an in-house product photography studio: ads campaigns, video editing, CGI ads, graphic design, SEO, social media marketing and website design.",
    email: contact.email,
    ...(contact.phone && { telephone: contact.phone }),
    address: {
      "@type": "PostalAddress",
      streetAddress: "4th Floor, Site No. 19, Suvarna Heights, near Bus Stop, Suvarna Nagara, Doddabidarakallu",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560073",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", ...studioAddress.geo },
    hasMap: studioAddress.maps,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    areaServed: [
      { "@type": "City", name: "Bengaluru" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Product photography", "E-commerce photography", "Digital marketing", "Google Ads", "Meta Ads",
      "Video editing", "Video production", "CGI advertising", "3D product visuals", "Graphic design",
      "Branding", "Search engine optimization", "Social media marketing", "Website design", "Web development",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: groups.flatMap((g) =>
        g.items.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.body[0], url: `${SITE}/#${s.id}` },
        })),
      ),
    },
    employee: team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role, url: profileUrl(m.slug) })),
    sameAs: Object.values(socialLinks).filter(Boolean),
  });
}

export function memberJsonLd(m: TeamMember) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl(m.slug),
    mainEntity: {
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      description: m.summary,
      image: `${SITE}/team/${m.slug}.webp`,
      url: profileUrl(m.slug),
      knowsAbout: m.focus,
      worksFor: { "@type": "Organization", "@id": ORG_ID, name: "Lens & Layers Digital Solutions", url: `${SITE}/` },
    },
  });
}

const contactHtml = () => `
<section id="contact"><h2>Contact</h2><ul>
<li>Email: <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>
${contact.phone ? `<li>Phone: ${esc(contact.phone)}</li>` : ""}
<li>Hours: ${esc(contact.hours)}</li>
<li>Studio: <a href="${esc(studioAddress.maps)}">${esc(studioAddress.lines.join(", "))}</a></li>
</ul></section>
<p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a></p>`;

/** Text of the home page as plain HTML. */
export function homeSnapshot() {
  const services = groups
    .map(
      (g) => `<h3>${esc(g.label)}</h3>` +
        g.items
          .map((s) => `<article id="${s.id}"><h4>${esc(s.name)}</h4><p>${esc(s.tagline)}</p>${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}</article>`)
          .join(""),
    )
    .join("");
  return `<div class="seo-snap">
<h1>Lens &amp; Layers: digital marketing, product photography and ads agency in Bengaluru</h1>
<p>Every visual. Every strategy. Every reach. Lens &amp; Layers Digital Solutions is a Bengaluru creative studio for product photography, ads campaigns, video editing, CGI ads, graphic design, SEO, social media marketing and website design, all under one roof.</p>
<section id="studio"><h2>The studio</h2>${studio.map((s) => `<h3>${esc(s.title)}: ${esc(s.kicker)}</h3><p>${esc(s.body)}</p>`).join("")}</section>
<section id="services"><h2>Services</h2>${services}</section>
<section><h2>Industries we work with</h2><p>${industries.map(esc).join(", ")}</p></section>
<section id="team"><h2>Our team</h2><ul>${team.map((m) => `<li><a href="/${m.slug}">${esc(m.name)}</a>, ${esc(m.role)}</li>`).join("")}</ul></section>
${contactHtml()}
</div>`;
}

/** Text of a team member's page as plain HTML. */
export function memberSnapshot(m: TeamMember) {
  return `<div class="seo-snap">
<p><a href="/">Lens &amp; Layers Digital Solutions</a></p>
<h1>${esc(m.name)}</h1>
<p>${esc(m.role)} · ${esc(m.department)}</p>
<p>${esc(m.summary)}</p>
<h2>Focus areas</h2><ul>${m.focus.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
<h2>The rest of the crew</h2><ul>${team.filter((o) => o.slug !== m.slug).map((o) => `<li><a href="/${o.slug}">${esc(o.name)}</a>, ${esc(o.role)}</li>`).join("")}</ul>
<p><a href="/#contact">Work with ${esc(m.name.split(" ")[0])} and the team</a></p>
</div>`;
}

/** Every indexable page; lastmod is the build date. */
export function sitemap(date = new Date().toISOString().slice(0, 10)) {
  const urls = [`${SITE}/`, `${SITE}/privacy`, `${SITE}/terms`, ...team.map((m) => profileUrl(m.slug))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
}
