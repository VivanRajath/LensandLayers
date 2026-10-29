import type { Poster } from "../data";

/** Service poster: the 3:4 version where the layout stacks (≤991px), 9:16 by width elsewhere. */
export default function PosterImg({ p, alt, loading }: { p: Poster; alt: string; loading?: "lazy" }) {
  return (
    <picture>
      <source media="(max-width: 991px)" srcSet={p.compact} />
      {/* Desktop frames are about 17vw wide */}
      <img src={p.src} srcSet={p.srcSet} sizes="(max-width: 1150px) 190px, 17vw" alt={alt} loading={loading} />
    </picture>
  );
}
