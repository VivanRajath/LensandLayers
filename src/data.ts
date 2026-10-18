const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export type IconName =
  | "trend" | "search" | "social" | "camera" | "video" | "pen"
  | "doc" | "target" | "web" | "box" | "reel" | "chart";

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
  "Digital marketing, SEO, social media, photography & video production",
  "One studio for every layer of your brand — strategy, content, growth",
];

/** First image the strip collapses into, before any service is active. */
export const introImage = { src: u("1500051638674-ff996a0ec29e"), alt: "Wall of printed photographs" };

export const groups: ServiceGroup[] = [
  {
    id: "core",
    label: "Core Services",
    theme: "dark",
    items: [
      {
        id: "digital-marketing",
        name: "Digital Marketing",
        tagline: "Strategy first. Growth that compounds.",
        body: [
          "Full-funnel marketing plans built around your business goals: who to reach, what to say, and which channels actually deliver. Google Ads, Meta Ads, email and landing pages working as one connected system.",
          "Every campaign is tracked end to end — from first impression to closed lead — with monthly optimisation so your budget keeps getting smarter, not just bigger.",
        ],
        cta: "Start a campaign",
        img: u("1460925895917-afdab827c52f"),
        alt: "Analytics dashboard on a laptop",
        icon: "trend",
      },
      {
        id: "seo",
        name: "SEO",
        tagline: "Be the first answer, not the fifth result.",
        body: [
          "Technical audits, keyword research, on-page optimisation, local SEO and Google Business Profile management. We fix what is holding your site back, then build the content and links that earn rankings.",
          "Transparent monthly reporting shows keyword movement, organic traffic and — most importantly — the enquiries it brings in.",
        ],
        cta: "Get an SEO audit",
        img: u("1526628953301-3e589a6a8b74"),
        alt: "SEO performance metrics on screen",
        icon: "search",
      },
      {
        id: "social-media",
        name: "Social Media Marketing",
        tagline: "Content people stop for. Communities that stay.",
        body: [
          "Instagram, Facebook, LinkedIn and YouTube managed end to end: content calendars, design, captions, community management and creator collaborations.",
          "Paired with targeted paid social, we turn followers into customers and track it all back to real business results.",
        ],
        cta: "Grow your socials",
        img: u("1611926653458-09294b3142bf"),
        alt: "Social media apps on a phone",
        icon: "social",
      },
      {
        id: "photography",
        name: "Photography",
        tagline: "Images that tell your story at a glance.",
        body: [
          "Product, food, fashion, corporate, event and lifestyle shoots — in our studio or on location. Art direction, styling and professional retouching included.",
          "Every shoot is planned around where the images will live, so you walk away with assets ready for web, social, print and ads.",
        ],
        cta: "Book a shoot",
        img: u("1492691527719-9d1e07e534b4"),
        alt: "Photographer on a mountain at sunrise",
        icon: "camera",
      },
      {
        id: "video-editing",
        name: "Video Editing & Production",
        tagline: "From raw footage to final cut.",
        body: [
          "Brand films, ads, YouTube videos, reels, podcasts and event coverage. Scripting, filming, editing, colour grading, sound design and motion graphics — all in-house.",
          "Already have footage? Send it over and our editors will turn it into content that keeps people watching to the last frame.",
        ],
        cta: "Start a video",
        img: u("1574717024653-61fd2cf4d44d"),
        alt: "Video editing timeline",
        icon: "video",
      },
      {
        id: "branding",
        name: "Branding & Graphic Design",
        tagline: "A brand people recognise before they read it.",
        body: [
          "Logos, visual identity, brand guidelines, packaging, brochures and social templates. We define how your brand looks, sounds and feels across every touchpoint.",
          "The result is a consistent system your team can use every day — not just a logo file sitting in a folder.",
        ],
        cta: "Build your brand",
        img: u("1626785774573-4b799315345d"),
        alt: "Design apps on a tablet",
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
        id: "content-strategy",
        name: "Content Strategy & Copywriting",
        tagline: "The right words, in the right place.",
        body: [
          "Content pillars, blogs, website copy, ad copy and video scripts written for your audience and optimised for search — one consistent voice across every channel.",
        ],
        cta: "Talk content",
        img: u("1533750516457-a7f992034fec"),
        alt: "Writer planning content at a desk",
        icon: "doc",
      },
      {
        id: "performance-ads",
        name: "Performance Ads (PPC)",
        tagline: "Every rupee accounted for.",
        body: [
          "Google Search, Shopping, YouTube and Meta campaigns built for conversions, with creative testing, retargeting and conversion tracking set up properly from day one.",
        ],
        cta: "Launch ads",
        img: u("1563986768609-322da13575f3"),
        alt: "Managing ad campaigns on laptop and phone",
        icon: "target",
      },
      {
        id: "web-design",
        name: "Website Design & Development",
        tagline: "Fast, beautiful sites built to convert.",
        body: [
          "Responsive websites, landing pages and online stores designed around your content and built SEO-ready, with analytics and lead capture wired in from launch.",
        ],
        cta: "Plan a website",
        img: u("1609921212029-bb5a28e60960"),
        alt: "Website layouts on a monitor",
        icon: "web",
      },
      {
        id: "product-shoots",
        name: "Product & E-commerce Shoots",
        tagline: "Catalogue-ready. Marketplace-approved.",
        body: [
          "White-background, lifestyle and 360° product photography for Amazon, Flipkart, Shopify and your own store — delivered in every size each platform needs.",
        ],
        cta: "Shoot products",
        img: u("1502920917128-1aa500764cbd"),
        alt: "Product shot of a camera on white",
        icon: "box",
      },
      {
        id: "reels",
        name: "Reels & Short-form Content",
        tagline: "Hook in one second. Hold for thirty.",
        body: [
          "Monthly packages of trend-aware reels, shorts and stories: concept, shoot, edit, captions and posting — built for reach on Instagram and YouTube.",
        ],
        cta: "Get reels",
        img: u("1542038784456-1ea8e935640e"),
        alt: "Creator holding a camera",
        icon: "reel",
      },
      {
        id: "growth-reviews",
        name: "Monthly Growth Reviews",
        tagline: "Clear numbers. Clear next steps.",
        body: [
          "A sit-down every month covering reach, engagement, leads, spend and ROI, with a plan for what we test next. No jargon, no vanity metrics.",
        ],
        cta: "See a sample report",
        img: u("1557804506-669a67965ba0"),
        alt: "Team presenting a strategy review",
        icon: "chart",
      },
    ],
  },
];

export const allServices = groups.flatMap((g) => g.items.map((s) => ({ ...s, group: g.id, theme: g.theme })));

export const studio = [
  {
    num: "01",
    kicker: "In-house Studio",
    title: "Lens Studio",
    body: "Photographers, videographers, editors and designers working side by side. Shoots, edits, motion graphics and brand assets are produced in-house — nothing gets lost in hand-offs and turnaround stays fast.",
    img: u("1559136555-9303baea8ebd", 1200),
    alt: "Creative team working in a studio",
  },
  {
    num: "02",
    kicker: "Performance Lab",
    title: "Layers Analytics",
    body: "Live dashboards tracking rankings, reach, leads and ROAS across Google, Meta and your website. You always know what is working, what is not, and where the next rupee should go.",
    img: u("1551434678-e076c223a692", 1200),
    alt: "Marketing team analysing campaign data",
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
