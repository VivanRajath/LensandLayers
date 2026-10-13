import { Fragment, useRef, type ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  /** Lines of the heading. Wrap words in [brackets] to render them muted. */
  lines: string[];
  as?: ElementType;
  className?: string;
  /** "scroll": characters fade in when the heading enters the viewport. "manual": parent triggers via the `split-ready` class. */
  mode?: "scroll" | "manual";
};

/**
 * Headline split into characters that fade in left-to-right, the way the
 * reference site's display headings resolve as they enter the viewport.
 */
export default function SplitHeading({ lines, as: Tag = "h2", className = "", mode = "scroll" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (mode !== "scroll") return;
      const chars = ref.current!.querySelectorAll(".ch");
      gsap.fromTo(
        chars,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
          stagger: { each: 0.018 },
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={lines.join(" ").replace(/[[\]]/g, "")}>
      {lines.map((line, li) => (
        <span className="split-line" key={li} aria-hidden="true">
          {tokenize(line).map((tok, ti, all) => (
            <Fragment key={ti}>
              <span className={`split-word${tok.muted ? " is-muted" : ""}`}>
                {[...tok.text].map((c, ci) => (
                  <span className="ch" key={ci}>
                    {c}
                  </span>
                ))}
              </span>
              {ti < all.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

function tokenize(line: string) {
  const out: { text: string; muted: boolean }[] = [];
  const re = /\[([^\]]+)\]|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) m[1].split(" ").forEach((w) => out.push({ text: w, muted: true }));
    else out.push({ text: m[2], muted: false });
  }
  return out;
}
