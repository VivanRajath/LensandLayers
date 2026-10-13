import type { IconName } from "../data";

const paths: Record<IconName, string> = {
  trend: "M6 36l11-11 8 8 15-17M30 16h10v10",
  search: "M20 8a12 12 0 1 0 0 24a12 12 0 1 0 0-24M29 29l11 11",
  social: "M10 8h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2M24 17a7 7 0 1 0 0 14a7 7 0 1 0 0-14M33 14h.01",
  camera: "M6 16h8l3-5h14l3 5h8v22H6zM24 19a7 7 0 1 0 0 14a7 7 0 1 0 0-14",
  video: "M5 12h28v24H5zM33 21l10-6v18l-10-6",
  pen: "M8 40l6-16 18-18 10 10-18 18zM14 24l10 10",
  doc: "M10 6h20l8 8v28H10zM16 22h16M16 29h16M16 36h10",
  target: "M24 7a17 17 0 1 0 0 34a17 17 0 1 0 0-34M24 15a9 9 0 1 0 0 18a9 9 0 1 0 0-18M24 23v2",
  web: "M5 9h38v30H5zM5 17h38M18 26l-4 4 4 4M30 26l4 4-4 4",
  box: "M24 5l17 9v20l-17 9-17-9V14zM7 14l17 9 17-9M24 23v20",
  reel: "M13 4h22v40H13zM21 19l8 5-8 5z",
  chart: "M8 40V8M8 40h32M15 32V22M23 32V14M31 32V26M39 32V18",
};

/** Line icon sitting on a dotted grid tile, echoing the reference's pixel icons. */
export default function Icon({ name }: { name: IconName }) {
  return (
    <span className="svc-ic" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <path d={paths[name]} />
      </svg>
    </span>
  );
}
