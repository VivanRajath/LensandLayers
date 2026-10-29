import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { team, profileUrl, type TeamMember } from "./src/team";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fillMember = (html: string, m: TeamMember) =>
  html
    .replaceAll("__MEMBER_NAME__", escapeHtml(m.name))
    .replaceAll("__MEMBER_ROLE__", escapeHtml(m.role))
    .replaceAll("__MEMBER_SUMMARY__", escapeHtml(m.summary))
    .replaceAll("__MEMBER_URL__", profileUrl(m.slug))
    .replaceAll("__MEMBER_SLUG__", m.slug);

/**
 * One page per team member at /<slug> (e.g. lensandlayers.in/vivan, which the QR codes open).
 * member.html is the shared template: the build writes it out as dist/<slug>.html for each
 * member (Cloudflare Pages serves those at /<slug>, like /privacy), and the dev server
 * answers /<slug> with it.
 */
function memberPages(): Plugin {
  const bySlug = new Map(team.map((m) => [m.slug, m]));
  const slugOf = (url = "") => url.split(/[?#]/)[0].replace(/^\/|\/$/g, "");
  return {
    name: "member-pages",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (bySlug.has(slugOf(req.url))) req.url = "/member.html";
        next();
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const m = ctx.server && bySlug.get(slugOf(ctx.originalUrl));
        return m ? fillMember(html, m) : html;
      },
    },
    writeBundle(options) {
      const dir = options.dir!;
      const template = join(dir, "member.html");
      const html = readFileSync(template, "utf8");
      for (const m of team) writeFileSync(join(dir, `${m.slug}.html`), fillMember(html, m));
      rmSync(template);
    },
  };
}

export default defineConfig({
  plugins: [react(), memberPages()],
  build: {
    rollupOptions: {
      // Main site plus the static legal pages (served as /privacy and /terms on Cloudflare Pages)
      // and the team-member page template (written out per member by memberPages).
      input: {
        main: "index.html",
        privacy: "privacy.html",
        terms: "terms.html",
        member: "member.html",
      },
    },
  },
});
