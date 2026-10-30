export type IconName =
  | "trend" | "search" | "social" | "camera" | "video" | "pen"
  | "doc" | "target" | "web" | "box" | "reel" | "chart" | "megaphone" | "cube";

export type Service = {
  id: string;
  name: string;
  tagline: string;
  body: string[];
  cta: string;
  img: Poster;
  alt: string;
  icon: IconName;
};

export type ServiceGroup = {
  id: "core" | "integrated";
  label: string;
  theme: "dark" | "light";
  items: Service[];
};

/** Client artwork lives in /public (from the Lens & Layers Drive folders). */
// import.meta.env is missing when vite.config.ts imports this file to write the SEO markup.
const asset = (path: string) => `${import.meta.env?.BASE_URL ?? "/"}${path}`;

/** Hero artwork (its headline is part of the image): 16:9 by width, plus a 4:3 cut for phones. */
export const heroImage = {
  src: asset("hero/hero-1920.webp"),
  srcSet: [640, 1280, 1920, 2560].map((w) => `${asset(`hero/hero-${w}.webp`)} ${w}w`).join(", "),
  compact: asset("hero/hero-1280x960.webp"),
  alt: "Expand your brand digitally with us: a robotic hand reaching for a human hand",
};

/**
 * Each service poster comes as 9:16 in four widths (desktop frames) and as a 3:4 version
 * laid out for phones and tablets: services/<name>-<360|720|1080|1440|480>.webp.
 */
export type Poster = { src: string; srcSet: string; compact: string };
const poster = (name: string): Poster => ({
  src: asset(`services/${name}-1080.webp`),
  srcSet: [360, 720, 1080, 1440].map((w) => `${asset(`services/${name}-${w}.webp`)} ${w}w`).join(", "),
  compact: asset(`services/${name}-480.webp`),
});

/** First image the strip collapses into, before any service is active. */
export const introImage = { ...poster("intro"), alt: "The Lens & Layers team planning brand, marketing and content work" };

export const groups: ServiceGroup[] = [
  {
    id: "core",
    label: "Core Services",
    theme: "dark",
    items: [
      {
        id: "digital-marketing",
        name: "Digital Marketing",
        tagline: "Every channel. One growth plan.",
        body: [
          "Google Ads, social media marketing, email campaigns and SEO run as one connected system, aimed at the audience that actually buys from you.",
          "Live campaign dashboards track impressions, engagement, conversions and ad spend, so every decision is backed by numbers and every month performs better than the last.",
        ],
        cta: "Start a campaign",
        img: poster("digital-marketing"),
        alt: "Digital marketing campaign dashboard with Google Ads, email and social metrics",
        icon: "trend",
      },
      {
        id: "seo",
        name: "SEO",
        tagline: "Search. Optimize. Grow.",
        body: [
          "Technical optimization, on-page SEO, high-quality content and quality backlinks that move you up the rankings and keep you there.",
          "Complete SEO solutions for real business growth: higher rankings, targeted traffic and measurable performance improvement, reported every month.",
        ],
        cta: "Get an SEO audit",
        img: poster("seo"),
        alt: "SEO artwork showing rankings, backlinks, on-page SEO and targeted traffic",
        icon: "search",
      },
      {
        id: "social-media",
        name: "Social Media Management & Marketing",
        tagline: "Strategy • Content • Community • Growth",
        body: [
          "Instagram, Facebook, YouTube and LinkedIn handled end to end: content calendars, post and reel design, captions and community management.",
          "Paired with targeted promotion, we turn followers into a community and a community into customers, with growth you can see in the numbers.",
        ],
        cta: "Grow your socials",
        img: poster("social-media"),
        alt: "Hand holding a phone surrounded by social media icons",
        icon: "social",
      },
      {
        id: "product-photography",
        name: "Product Photography",
        tagline: "Studio-lit. Scroll-stopping. Ready to sell.",
        body: [
          "Professional product photography in our own Bengaluru studio, with lighting, styling, props and retouching handled by the Lens & Layers crew.",
          "White-background catalogue shots, lifestyle setups and hero images delivered in every size you need for your website, Amazon and Flipkart listings, social and print.",
        ],
        cta: "Book a shoot",
        img: poster("product-photography"),
        alt: "Lens & Layers crew shooting a product in a lit studio",
        icon: "camera",
      },
      {
        id: "video-editing",
        name: "Video Editing",
        tagline: "Make every frame count.",
        body: [
          "Creative editing. Stories that connect. Social content, motion design, audio polish and brand stories cut to keep people watching.",
          "From reels and ads to brand films and YouTube, we handle pacing, colour grading, sound and motion graphics for a broadcast-ready finish.",
        ],
        cta: "Start a video",
        img: poster("video-editing"),
        alt: "Editor working on a video timeline: video that moves",
        icon: "video",
      },
      {
        id: "graphic-design",
        name: "Graphic Design",
        tagline: "Branding | Visuals | Impact",
        body: [
          "From ideas to stunning visuals, we create designs that communicate, connect and convert.",
          "Branding that builds a strong identity, creative designs for every need, social media graphics that stand out online, print design from concept to print, and packaging that sells products.",
        ],
        cta: "Build your brand",
        img: poster("graphic-design"),
        alt: "Creative graphic design artwork with a stylus and paint splash",
        icon: "pen",
      },
    ],
  },
  {
    id: "integrated",
    label: "Integrated Solutions",
    theme: "light",
    items: [
      {
        id: "ads-campaign",
        name: "Ads Campaign",
        tagline: "Strategy | Create | Optimize | Grow",
        body: [
          "Full-funnel campaigns across Google Ads, Meta Ads (Facebook & Instagram), YouTube, TikTok, LinkedIn, Google Maps local ads and email.",
          "Audience research, creative design, campaign setup and ongoing optimization, all aimed at one thing: better ROI.",
        ],
        cta: "Launch a campaign",
        img: poster("ads-campaign"),
        alt: "Ads campaign dashboard with Google, Meta, YouTube, TikTok and LinkedIn ads",
        icon: "target",
      },
      {
        id: "advertising",
        name: "Advertising",
        tagline: "Be seen where your customers are looking.",
        body: [
          "Search ads, sponsored social posts and display creatives built around the right audience, designed in-house and tracked from first view to final sale.",
          "We plan the message, produce the creative and read the analytics, so your ad spend reaches people ready to act.",
        ],
        cta: "Plan your ads",
        img: poster("advertising"),
        alt: "Laptop showing ad performance with sponsored social posts and a target",
        icon: "megaphone",
      },
      {
        id: "cgi-ads",
        name: "CGI Designing & Marketing",
        tagline: "Build | Create | Grow",
        body: [
          "From ideas to visual impact. We design, create and market your brand for the digital world.",
          "Photoreal CGI ads, 3D product visuals and VFX sequences that make your brand impossible to scroll past, paired with the strategy to put them in front of the right people.",
        ],
        cta: "Create a CGI ad",
        img: poster("cgi-ads"),
        alt: "CGI artwork of a city skyline rising out of a laptop with a film strip",
        icon: "cube",
      },
      {
        id: "web-creation",
        name: "Website Creation",
        tagline: "Transform ideas into digital experiences.",
        body: [
          "Website design and development for modern brands: UI/UX design, custom builds and responsive layouts that look sharp on every screen.",
          "Every site is SEO-ready and built for high performance, so it loads fast, ranks well and turns visitors into enquiries.",
        ],
        cta: "Build your website",
        img: poster("web-creation"),
        alt: "Website mockups on laptop and phone: transform ideas into digital experiences",
        icon: "web",
      },
    ],
  },
];

export const allServices = groups.flatMap((g) => g.items.map((s) => ({ ...s, group: g.id, theme: g.theme })));

export const studio = [
  {
    num: "01",
    kicker: "Visual production house",
    title: "The Lens",
    body: "Our dedicated visual production house. We specialize in commercial photography, editorial stills, and cinema-grade brand films, using high-end optics and deliberate set lighting to craft assets that arrest attention immediately.",
    img: asset("studio/lens.webp"),
    alt: "Lens & Layers camera studio with cinema cameras and lighting",
  },
  {
    num: "02",
    kicker: "Digital execution ecosystem",
    title: "The Layers",
    body: "Our complete digital execution ecosystem. We manage full-funnel paid media campaigns, SEO authority, web architecture, and multi-channel strategies engineered to turn audience engagement into measurable revenue.",
    img: asset("studio/layer.webp"),
    alt: "Lens & Layers editing and design suite with multiple screens",
  },
];

export const industries = [
  "Fashion & Apparel", "Food & Hospitality", "Real Estate", "Healthcare & Wellness",
  "Education", "Retail & E-commerce", "Beauty & Salons", "Events & Weddings", "Startups & Tech",
];

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export { team, type TeamMember } from "./team";

/** Social profiles. Leave a value "" until the profile exists; those links then stay inert. */
export const socialLinks = {
  instagram: "https://www.instagram.com/lensandlayers.in/",
  linkedin: "",
  youtube: "https://www.youtube.com/@lensandlayersdigitalsolutions",
};

/**
 * Contact details shown across the site and given to search engines (src/seo.ts).
 * Phone: as it should be shown, e.g. "+91 98765 43210". Leave it "" until there's a real
 * number: the phone links stay hidden until then.
 */
export const contact = {
  email: "info@lensandlayers.in",
  phone: "",
  hours: "Mon – Fri · 10:00 AM – 6:00 PM",
};
export const phoneUrl = contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : "";

export const studioAddress = {
  lines: ["4th Floor, Site No. 19, Suvarna Heights", "Near Bus Stop, Suvarna Nagara, Doddabidarakallu", "Bengaluru, Karnataka 560073"],
  /** The studio's Google Maps place (its Business Profile). */
  maps: "https://maps.app.goo.gl/3gXB5LLFA6Nw9tG9A",
  geo: { latitude: 13.0328155, longitude: 77.4953222 },
};

/**
 * WhatsApp number with country code, digits only (e.g. "919876543210").
 * Until it's filled in, the WhatsApp buttons are hidden on the live site (shown in dev for previewing).
 */
export const whatsapp = {
  number: "",
  message: "Hi Lens & Layers! I'd like to talk about a project.",
};
export const whatsappUrl = whatsapp.number
  ? `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`
  : "";
