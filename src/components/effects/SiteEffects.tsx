"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("site-grain");
    return () => document.body.classList.remove("site-grain");
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--pointer-x", `${x}%`);
      document.documentElement.style.setProperty("--pointer-y", `${y}%`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = document.querySelector("main");
    if (!root) return;

    const candidates = root.querySelectorAll<HTMLElement>(
      "section, article, aside, .section-shell > div, .section-shell > form",
    );

    candidates.forEach((el, index) => {
      if (el.dataset.noReveal === "true") return;
      if (el.classList.contains("reveal-on-scroll")) return;
      // Skip tiny wrappers
      if (el.childElementCount === 0 && (el.textContent?.trim().length ?? 0) < 8) {
        return;
      }
      el.classList.add("reveal-on-scroll");
      el.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 60}ms`);
    });

    // Image zoom on common media wrappers
    root.querySelectorAll<HTMLElement>("article, figure").forEach((el) => {
      if (el.querySelector("img")) el.classList.add("img-zoom");
    });

    // Soft lift on bordered cards
    root
      .querySelectorAll<HTMLElement>(
        "[class*='rounded'][class*='border'], [class*='rounded'][class*='bg-white'], [class*='rounded'][class*='bg-ivory']",
      )
      .forEach((el) => {
        if (el.tagName === "SECTION") return;
        if (el.classList.contains("btn-glow") || el.classList.contains("btn-ghost-glow")) {
          return;
        }
        el.classList.add("surface-lift");
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    root.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
