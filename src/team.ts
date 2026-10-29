/**
 * Team directory. Kept free of Vite-only APIs (import.meta.env) so vite.config.ts and
 * scripts/qr.mjs can import it too: every member gets a page at /<slug> and a QR code for it.
 */

export const SITE = "https://lensandlayers.in";

export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  department: string;
  summary: string;
  /** Short tags shown on the member's page. */
  focus: string[];
};

export const profileUrl = (slug: string) => `${SITE}/${slug}`;

/** From the Lens & Layers Digital Solutions employee directory. Photos live in /public/team. */
export const team: TeamMember[] = [
  {
    id: "LL-001", slug: "deekshith", name: "Deekshith Kumar S", role: "Director & Marketing Head",
    department: "Creative Leadership & Media Operations",
    summary: "Directs the company's creative vision, high-impact commercial campaigns, brand architecture, and multi-channel marketing initiatives.",
    focus: ["Creative direction", "Commercial campaigns", "Brand architecture", "Multi-channel marketing"],
  },
  {
    id: "LL-002", slug: "deepak", name: "Deepak H K", role: "Head of Media House & Operations",
    department: "Creative Leadership & Media Operations",
    summary: "Spearheads entire media production logistics, equipment pipelines, studio scheduling, and commercial delivery. Ensures multi-channel creative productions run smoothly from initial brief to broadcast-ready master delivery.",
    focus: ["Production logistics", "Studio scheduling", "Equipment pipelines", "Broadcast delivery"],
  },
  {
    id: "LL-003", slug: "vikas", name: "Vikas H C", role: "3D & VFX Artist",
    department: "Post-Production, VFX & Graphic Design",
    summary: "3D artist covering asset creation, photorealistic environment texturing, and dynamic visual effects compositing. Transforms concept storyboards into immersive 3D sequences and visual effects for cinematic commercials.",
    focus: ["3D asset creation", "Environment texturing", "VFX compositing", "CGI commercials"],
  },
  {
    id: "LL-004", slug: "supreeth", name: "Supreeth", role: "Video Editor & Motion Graphics Artist",
    department: "Post-Production, VFX & Graphic Design",
    summary: "Commands visual rhythm, narrative pacing, dynamic transitions, and modern kinetic motion graphics. Delivers high-engagement cuts for brand commercials and social campaigns with precise color grading pipelines.",
    focus: ["Video editing", "Motion graphics", "Color grading", "Social cuts"],
  },
  {
    id: "LL-005", slug: "abhishek", name: "Abhishek Kavaloor", role: "Graphic Designer",
    department: "Post-Production, VFX & Graphic Design",
    summary: "Crafts distinct visual brand languages across identity systems, print collateral, key visual campaign posters, and digital marketing creatives. Focuses on typographic precision, bold layout composition, and marketing resonance.",
    focus: ["Brand identity", "Print collateral", "Campaign key visuals", "Typography"],
  },
  {
    id: "LL-006", slug: "vivan", name: "Vivan Rajath", role: "Web Developer",
    department: "Engineering, Analytics & Content",
    summary: "Architects modern, responsive web experiences, interactive agency showcases, and robust digital platforms. Ensures lightning-fast load speeds, responsive layouts across devices, and clean, scalable code architecture.",
    focus: ["Responsive websites", "Interactive showcases", "Performance", "Scalable code"],
  },
  {
    id: "LL-007", slug: "rachana", name: "Rachana S", role: "Business & Data Analyst",
    department: "Engineering, Analytics & Content",
    summary: "Analyzes market patterns, campaign metrics, audience behaviors, and business ROI data. Converts raw analytical tracking into strategic business decisions and growth recommendations for creative campaigns.",
    focus: ["Campaign metrics", "Audience insights", "ROI analysis", "Growth strategy"],
  },
  {
    id: "LL-008", slug: "dushyanth", name: "Dushyanth", role: "Senior Content & Copywriter",
    department: "Engineering, Analytics & Content",
    summary: "Develops persuasive commercial scripts, creative storytelling, ad copy, and brand narratives that capture consumer attention. Masters tone of voice to craft authentic messaging across digital and print mediums.",
    focus: ["Commercial scripts", "Ad copy", "Brand storytelling", "Tone of voice"],
  },
  {
    id: "LL-009", slug: "sharath", name: "Sharath", role: "Sound Designer & Audio Engineer",
    department: "Audio & Sound Design",
    summary: "Engineers rich audio experiences, cinematic soundscapes, spatial foley, and dialogue enhancement for commercials, digital films, and promotional releases.",
    focus: ["Sound design", "Cinematic soundscapes", "Foley", "Dialogue enhancement"],
  },
];
