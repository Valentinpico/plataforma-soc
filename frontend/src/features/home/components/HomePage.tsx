// Landing del grupo META — compose de secciones en orden semántico.
// Cada sección gestiona su propio ancho; el root no impone max-w.
// Un IntersectionObserver revela los elementos .on-scroll al entrar en viewport.
import { useEffect } from "react";
import { Hero } from "./Hero";
import { StatsBand } from "./StatsBand";
import { AboutSection } from "./AboutSection";
import { ResearchLinesSection } from "./ResearchLinesSection";
import { FocusAreasSection } from "./FocusAreasSection";
import { TeamSection } from "./TeamSection";
import { ResearchAreasSection } from "./ResearchAreasSection";
import { ProjectsSection } from "./ProjectsSection";
import { CollaboratorsMarquee } from "./CollaboratorsMarquee";
import { SiteFooter } from "./SiteFooter";

export function HomePage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".on-scroll").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <StatsBand />
      <AboutSection />
      <ResearchLinesSection />
      <FocusAreasSection />
      <TeamSection />
      <ResearchAreasSection />
      <ProjectsSection />
      <CollaboratorsMarquee />
      <SiteFooter />
    </>
  );
}
