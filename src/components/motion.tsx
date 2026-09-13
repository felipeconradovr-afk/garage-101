"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function Motion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 901px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const desktop = context.conditions.desktop;
      const scope = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline.from(".hero .eyebrow", { y: 12, opacity: 0, duration: .6 })
          .from(".hero-line", { yPercent: 108, duration: 1, stagger: .12 }, "-=.35")
          .from(".hero-art", { clipPath: "inset(0 0 100% 0)", opacity: 0, duration: 1.25 }, "<.1")
          .from(".hero-description, .hero-actions, .hero-note", { y: 15, opacity: 0, duration: .6, stagger: .09 }, "-=.5");
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, { y: desktop ? 34 : 18, opacity: 0, duration: .75, scrollTrigger: { trigger: element, start: "top 91%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".polish-step").forEach((step) => {
          gsap.from(step, { x: desktop ? 22 : 10, opacity: .2, duration: .65, scrollTrigger: { trigger: step, start: "top 80%", toggleActions: "play none none reverse" } });
        });
        if (desktop) {
          gsap.to(".polish-art", { yPercent: 5, ease: "none", scrollTrigger: { trigger: ".polish-section", start: "top bottom", end: "bottom top", scrub: 1 } });
        }
      }, root);
      return () => scope.revert();
    });
    return () => media.revert();
  }, [pathname]);
  return <div ref={root}>{children}</div>;
}
