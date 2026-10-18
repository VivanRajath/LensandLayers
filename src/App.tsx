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

  // Images change layout heights; recalculate scroll positions once they're in.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

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
