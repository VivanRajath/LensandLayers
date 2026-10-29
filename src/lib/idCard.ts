import { profileUrl, type TeamMember } from "../team";

/**
 * Draws a team member's ID card (portrait, ID-1 / CR80 proportions) in the site's style:
 * dark photo stage with the blue spotlight, name and role, and a white strip with the
 * QR code that opens their page. Returns a PNG.
 */

const W = 1080;
const H = 1712; // 54 × 85.6 mm
const PAD = 72;
const STRIP = 1352; // top of the white QR strip

const C = {
  black: "#111111",
  white: "#ffffff",
  brand: "#2337ff",
  violet: "#8b97ff",
  ink: "#111111",
  note: "rgba(17,17,17,0.5)",
  soft: "rgba(255,255,255,0.6)",
  line: "rgba(255,255,255,0.14)",
};

const DISPLAY = "Archivo, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  return img.decode().then(() => img);
}

/** Archivo at 125% width is the site's display face; canvas only gets it through fontStretch. */
function setFont(ctx: CanvasRenderingContext2D, weight: number, size: number, family: string, wide = false) {
  ctx.font = `${weight} ${size}px ${family}`;
  if ("fontStretch" in ctx) ctx.fontStretch = wide ? "expanded" : "normal";
}

/** Largest size (down to min) at which every line fits maxWidth. */
function fitSize(ctx: CanvasRenderingContext2D, lines: string[], weight: number, max: number, min: number, maxWidth: number) {
  for (let size = max; size > min; size -= 2) {
    setFont(ctx, weight, size, DISPLAY, true);
    if (lines.every((l) => ctx.measureText(l).width <= maxWidth)) return size;
  }
  return min;
}

/** Name on one line if it fits large enough, otherwise split across two. */
function nameLines(ctx: CanvasRenderingContext2D, name: string, maxWidth: number) {
  const upper = name.toUpperCase();
  const one = fitSize(ctx, [upper], 800, 110, 40, maxWidth);
  const words = upper.split(" ");
  if (one >= 76 || words.length < 2) return { lines: [upper], size: one };
  // Break where the longer of the two lines is shortest, e.g. "DEEKSHITH / KUMAR S"
  let lines: string[] = [];
  let best = Infinity;
  for (let cut = 1; cut < words.length; cut++) {
    const pair = [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
    const widest = Math.max(...pair.map((l) => ctx.measureText(l).width));
    if (widest < best) [best, lines] = [widest, pair];
  }
  return { lines, size: fitSize(ctx, lines, 800, 110, 40, maxWidth) };
}

function dots(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  for (const [dx, dy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) ctx.fillRect(dx - 4, dy - 4, 8, 8);
}

export async function renderIdCard(m: TeamMember): Promise<Blob> {
  const fonts = document.fonts;
  await Promise.all([
    fonts.load(`expanded 800 100px Archivo`),
    fonts.load(`600 40px Archivo`),
    fonts.load(`500 24px "JetBrains Mono"`),
  ]).catch(() => undefined);
  const [photo, logo, qr] = await Promise.all([
    loadImage(asset(`team/${m.slug}.webp`)),
    loadImage(asset("brand/logo-light.webp")),
    loadImage(asset(`qr/${m.slug}.png`)),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const first = m.name.split(" ")[0].toUpperCase();
  const link = profileUrl(m.slug).replace(/^https?:\/\//, "");

  // Rounded card
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 44);
  ctx.clip();
  ctx.fillStyle = C.black;
  ctx.fillRect(0, 0, W, H);

  // Lanyard slot
  ctx.fillStyle = "#262626";
  ctx.beginPath();
  ctx.roundRect(W / 2 - 80, 40, 160, 22, 11);
  ctx.fill();

  // Header: logo left, staff ID right
  const logoH = 46;
  ctx.drawImage(logo, PAD, 92, (logo.naturalWidth / logo.naturalHeight) * logoH, logoH);
  setFont(ctx, 500, 26, MONO);
  ctx.fillStyle = C.violet;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(m.id, W - PAD, 92 + logoH / 2);
  ctx.textAlign = "left";

  // Stage: spotlight, outlined first name, photo fading into the dark
  const stageTop = 170;
  const glow = ctx.createRadialGradient(W / 2, 560, 0, W / 2, 560, 440);
  glow.addColorStop(0, "rgba(35,55,255,0.55)");
  glow.addColorStop(0.55, "rgba(35,55,255,0.14)");
  glow.addColorStop(1, "rgba(35,55,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, stageTop, W, 900);

  const ghost = fitSize(ctx, [first], 800, 320, 80, W - 40);
  setFont(ctx, 800, ghost, DISPLAY, true);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeText(first, W / 2, stageTop + 20);
  ctx.textAlign = "left";

  const photoH = 860;
  const photoW = (photo.naturalWidth / photo.naturalHeight) * photoH;
  ctx.drawImage(photo, (W - photoW) / 2, stageTop + 10, photoW, photoH);
  const fade = ctx.createLinearGradient(0, stageTop + photoH - 260, 0, stageTop + photoH + 10);
  fade.addColorStop(0, "rgba(17,17,17,0)");
  fade.addColorStop(0.8, C.black);
  ctx.fillStyle = fade;
  ctx.fillRect(0, stageTop + photoH - 260, W, 270);
  dots(ctx, PAD - 24, stageTop, W - 2 * PAD + 48, photoH - 40, "rgba(255,255,255,0.4)");

  // Name, role, department (bottom-aligned above the strip)
  const textW = W - 2 * PAD;
  const { lines, size } = nameLines(ctx, m.name, textW);
  setFont(ctx, 600, 38, DISPLAY);
  const roleSize = fitSize(ctx, [m.role], 600, 40, 26, textW) * 0.9;
  let y = STRIP - 64 - 30 - 28 - roleSize - 18 - lines.length * size * 0.92;
  ctx.textBaseline = "top";
  ctx.fillStyle = C.white;
  setFont(ctx, 800, size, DISPLAY, true);
  for (const l of lines) {
    ctx.fillText(l, PAD, y);
    y += size * 0.92;
  }
  y += 18;
  setFont(ctx, 600, roleSize, DISPLAY);
  ctx.fillStyle = C.violet;
  ctx.fillText(m.role, PAD, y);
  y += roleSize + 28;
  ctx.fillStyle = C.line;
  ctx.fillRect(PAD, y, textW, 2);
  y += 22;
  setFont(ctx, 500, 22, MONO);
  ctx.fillStyle = C.soft;
  ctx.fillText(m.department.toUpperCase(), PAD, y, textW);

  // White strip: QR + where it goes
  ctx.fillStyle = C.white;
  ctx.fillRect(0, STRIP, W, H - STRIP);
  const qrSize = 300;
  const qrY = STRIP + (H - STRIP - 18 - qrSize) / 2;
  ctx.drawImage(qr, PAD - 24, qrY, qrSize, qrSize); // the PNG carries its own white margin
  const tx = PAD - 24 + qrSize + 28;
  const tw = W - PAD - tx;
  ctx.textBaseline = "top";
  setFont(ctx, 500, 22, MONO);
  ctx.fillStyle = C.note;
  ctx.fillText("SCAN TO MEET", tx, qrY + 52);
  setFont(ctx, 800, fitSize(ctx, [first], 800, 72, 36, tw), DISPLAY, true);
  ctx.fillStyle = C.ink;
  ctx.fillText(first, tx, qrY + 90);
  setFont(ctx, 500, 26, MONO);
  ctx.fillStyle = C.brand;
  ctx.fillText(link, tx, qrY + 200, tw);
  setFont(ctx, 500, 20, MONO);
  ctx.fillStyle = C.note;
  ctx.fillText("LENS & LAYERS DIGITAL SOLUTIONS", tx, qrY + 244, tw);

  // Brand edge
  ctx.fillStyle = C.brand;
  ctx.fillRect(0, H - 18, W, 18);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create the ID card image"))), "image/png"),
  );
}

/** Saves a file through a temporary link (works for blob: and same-origin URLs). */
export function saveFile(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
}

export const idCardFilename = (m: TeamMember) => `lens-and-layers-${m.slug}-id-card.png`;

export async function downloadIdCard(m: TeamMember) {
  const url = URL.createObjectURL(await renderIdCard(m));
  saveFile(url, idCardFilename(m));
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
