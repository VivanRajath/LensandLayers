// Generates a QR code for every team member's page (lensandlayers.in/<slug>).
//   npm run qr
// Writes public/qr/<slug>.svg (shown on the page) and public/qr/<slug>.png (print-ready download).
// Re-run after adding or renaming a team member, and commit the files.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { team, profileUrl } from "../src/team.ts";

const out = fileURLToPath(new URL("../public/qr/", import.meta.url));
mkdirSync(out, { recursive: true });

// High error correction keeps codes scannable when printed small or partly covered.
const base = { errorCorrectionLevel: "Q", color: { dark: "#111111", light: "#ffffff" } };

for (const m of team) {
  const url = profileUrl(m.slug);
  writeFileSync(join(out, `${m.slug}.svg`), await QRCode.toString(url, { ...base, type: "svg", margin: 0 }));
  await QRCode.toFile(join(out, `${m.slug}.png`), url, { ...base, width: 1200, margin: 4 });
  console.log(`${m.slug.padEnd(10)} ${url}`);
}
