/**
 * Animate-on-scroll for elements GSAP doesn't already handle: mark one with
 * data-aos="fade-up" | "fade" | "zoom-in" (optionally style --aos-delay) and it eases in the
 * first time it scrolls into view. The styles live in styles.css under "Animate on scroll".
 *
 * Elements stay visible until this runs (html.aos gates the hidden state), so nothing is ever
 * stuck invisible if the script fails. React renders after start(), so new elements are picked
 * up as they're added.
 */
export function startAos() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("aos");

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("aos-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  const watch = (root: ParentNode) => root.querySelectorAll("[data-aos]:not(.aos-in)").forEach((el) => io.observe(el));
  watch(document);
  new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches("[data-aos]") ? io.observe(n) : watch(n)));
  }).observe(document.body, { childList: true, subtree: true });
}
