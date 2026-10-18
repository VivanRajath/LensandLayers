const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export type IconName =
  | "trend" | "search" | "social" | "camera" | "video" | "pen"
  | "doc" | "target" | "web" | "box" | "reel" | "chart" | "megaphone" | "cube";

export type Service = {
  id: string;
  name: string;
  tagline: string;
  body: string[];
  cta: string;
  img: string;
  alt: string;
  icon: IconName;
};

export type ServiceGroup = {
  id: "core" | "integrated";
  label: string;
  theme: "dark" | "light";
  items: Service[];
};

export const heroImage = u("1493863641943-9b68992a8d07", 2400);

export const heroTaglines = [
  "Digital marketing, SEO, social media, product photography, video editing & CGI ads",
  "One studio for every layer of your brand — strategy, content, growth",
];

/** Client artwork lives in /public (from the Lens & Layers Drive folders). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** First image the strip collapses into, before any service is active. */
export const introImage = { src: asset("studio/lens-portrait.webp"), alt: "Lens & Layers camera studio" };

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
        img: asset("services/digital-marketing.webp"),
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
        img: asset("services/seo.webp"),
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
        img: asset("services/social-media.webp"),
        alt: "Hand holding a phone surrounded by social media icons",
        icon: "social",
      },
      {
        id: "product-photography",
        name: "Product Photography",
        tagline: "Studio-lit. Scroll-stopping. Ready to sell.",
        body: [
          "Professional product shoots in our own studio, with lighting, styling, props and retouching handled by the Lens & Layers crew.",
          "White-background catalogue shots, lifestyle setups and hero images delivered in every size you need for e-commerce, marketplaces, social and print.",
        ],
        cta: "Book a shoot",
        img: asset("services/product-photography.webp"),
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
        img: asset("services/video-editing.webp"),
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
        img: asset("services/graphic-design.webp"),
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
        img: asset("services/ads-campaign.webp"),
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
        img: asset("services/advertising.webp"),
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
        img: asset("services/cgi-ads.webp"),
        alt: "CGI artwork of a city skyline rising out of a laptop with a film strip",
        icon: "cube",
      },
      {
        id: "web-creation",
        name: "Website Creation",
        tagline: "Transform ideas into digital experiences.",
        body: [
          "Creative websites for modern brands: UI/UX design, web development and responsive layouts that look sharp on every screen.",
          "Every site is SEO-ready and built for high performance, so it loads fast, ranks well and turns visitors into enquiries.",
        ],
        cta: "Build your website",
        img: asset("services/web-creation.webp"),
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

export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  department: string;
  summary: string;
};

/** From the Lens & Layers Digital Solutions employee directory. Photos live in /public/team. */
export const team: TeamMember[] = [
  {
    id: "LL-001", slug: "deekshith", name: "Deekshith Kumar S", role: "Director & Marketing Head",
    department: "Creative Leadership & Media Operations",
    summary: "Directs the company's creative vision, high-impact commercial campaigns, brand architecture, and multi-channel marketing initiatives.",
  },
  {
    id: "LL-002", slug: "deepak", name: "Deepak", role: "Head of Media House & Operations",
    department: "Creative Leadership & Media Operations",
    summary: "Spearheads entire media production logistics, equipment pipelines, studio scheduling, and commercial delivery. Ensures multi-channel creative productions run smoothly from initial brief to broadcast-ready master delivery.",
  },
  {
    id: "LL-003", slug: "vikas", name: "Vikas", role: "3D & VFX Artist",
    department: "Post-Production, VFX & Graphic Design",
    summary: "3D artist covering asset creation, photorealistic environment texturing, and dynamic visual effects compositing. Transforms concept storyboards into immersive 3D sequences and visual effects for cinematic commercials.",
  },
  {
    id: "LL-004", slug: "supreeth", name: "Supreeth", role: "Video Editor & Motion Graphics Artist",
    department: "Post-Production, VFX & Graphic Design",
    summary: "Commands visual rhythm, narrative pacing, dynamic transitions, and modern kinetic motion graphics. Delivers high-engagement cuts for brand commercials and social campaigns with precise color grading pipelines.",
  },
  {
    id: "LL-005", slug: "abhishek", name: "Abhishek", role: "Graphic Designer",
    department: "Post-Production, VFX & Graphic Design",
    summary: "Crafts distinct visual brand languages across identity systems, print collateral, key visual campaign posters, and digital marketing creatives. Focuses on typographic precision, bold layout composition, and marketing resonance.",
  },
  {
    id: "LL-006", slug: "vihan", name: "Vihan", role: "Web Developer",
    department: "Engineering, Analytics & Content",
    summary: "Architects modern, responsive web experiences, interactive agency showcases, and robust digital platforms. Ensures lightning-fast load speeds, responsive layouts across devices, and clean, scalable code architecture.",
  },
  {
    id: "LL-007", slug: "rachana", name: "Rachana", role: "Business & Data Analyst",
    department: "Engineering, Analytics & Content",
    summary: "Analyzes market patterns, campaign metrics, audience behaviors, and business ROI data. Converts raw analytical tracking into strategic business decisions and growth recommendations for creative campaigns.",
  },
  {
    id: "LL-008", slug: "dushyanth", name: "Dushyanth", role: "Senior Content & Copywriter",
    department: "Engineering, Analytics & Content",
    summary: "Develops persuasive commercial scripts, creative storytelling, ad copy, and brand narratives that capture consumer attention. Masters tone of voice to craft authentic messaging across digital and print mediums.",
  },
  {
    id: "LL-009", slug: "sharath", name: "Sharath", role: "Sound Designer & Audio Engineer",
    department: "Audio & Sound Design",
    summary: "Engineers rich audio experiences, cinematic soundscapes, spatial foley, and dialogue enhancement for commercials, digital films, and promotional releases.",
  },
];
