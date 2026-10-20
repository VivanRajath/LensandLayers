import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "./lib/scroll";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Studio from "./components/Studio";
import Services from "./components/Services";
import Team from "./components/Team";
import Cta from "./components/Cta";
import Footer from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);

  // Scroll-linked animations cache element positions. Anything that reflows the page after
  // they're measured (web fonts swapping in and re-wrapping headings, images, the scrollbar
  // returning after the loader) would leave every service line out of step with its image,
  // so re-measure whenever the page's size actually changes.
  useEffect(() => {
    let timer = 0;
    let last = "";
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const ro = new ResizeObserver(() => {
      const size = `${document.body.scrollWidth}x${document.body.scrollHeight}`;
      if (size !== last) {
        last = size;
        refresh();
      }
    });
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  // The loader hides the scrollbar; when it lifts, the page width changes.
  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <SmoothScroll>
      <Loader onDone={() => setReady(true)} />
      <Header />
      <main>
        <div className="hero-stack">
          <Hero ready={ready} />
          <Studio />
        </div>
        <Services />
        <Team />
        <Cta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
