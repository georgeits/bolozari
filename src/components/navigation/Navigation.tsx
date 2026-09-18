"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useNavUI } from "@/components/navigation/NavUIContext";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

function NavLinks({
  className,
  linkClassName,
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const active = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                linkClassName,
                active && "text-charcoal",
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Spacious editorial masthead — sits in the ivory band above the hero photo. */
export function HeroMasthead() {
  const { toggleMenu, menuOpen } = useNavUI();

  return (
    <div className="relative z-20">
      <div className="flex items-end justify-between gap-6 px-1 pb-5 pt-9 sm:pb-7 sm:pt-11 md:pb-9 md:pt-14">
        <div className="min-w-0">
          <Link
            href="/"
            className="font-editorial block text-[1.75rem] leading-none tracking-[-0.02em] text-charcoal transition duration-500 hover:text-burgundy sm:text-[2.05rem] md:text-[2.35rem]"
          >
            ბოლო ზარი
          </Link>
          <p className="font-ui mt-3 text-[0.68rem] tracking-[0.22em] text-burgundy-pale sm:text-[0.72rem]">
            კლასი 2027 · ციფრული წლის წიგნი
          </p>
        </div>

        <nav aria-label="მთავარი ნავიგაცია" className="hidden lg:block">
          <NavLinks
            className="flex max-w-[36rem] flex-wrap items-center justify-end gap-x-0.5 gap-y-1"
            linkClassName="nav-link-glow rounded-full px-3 py-2 text-[0.8rem] tracking-[0.04em] text-charcoal-soft transition-colors duration-300 hover:text-charcoal"
          />
        </nav>

        <button
          type="button"
          className="shrink-0 px-1 py-2 text-xs tracking-[0.16em] text-charcoal-soft transition-colors hover:text-charcoal lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={toggleMenu}
        >
          {menuOpen ? "დახურვა" : "მენიუ"}
        </button>
      </div>
      {/* Fires compact nav only after the masthead leaves the viewport */}
      <div id="nav-sentinel" className="h-px w-full" aria-hidden />
    </div>
  );
}

/** Compact floating bar — appears after scroll (and on subpages). */
export function Navigation() {
  const pathname = usePathname();
  const { compact, menuOpen, setMenuOpen, toggleMenu } = useNavUI();
  const onSubpage = pathname !== "/";
  const showCompact = onSubpage || compact;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 transition-[padding] duration-500 ease-out md:px-5",
          showCompact ? "pt-3 md:pt-4" : "pt-0",
        )}
      >
        <nav
          aria-label="შემოკლებული ნავიგაცია"
          aria-hidden={!showCompact}
          className={cn(
            "mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border px-3 transition-all duration-500 ease-out md:px-4",
            "bg-[rgba(247,243,235,0.72)] shadow-[0_8px_30px_rgba(40,20,24,0.08)] backdrop-blur-[16px] border-white/50",
            showCompact
              ? "pointer-events-auto translate-y-0 py-2 opacity-100"
              : "pointer-events-none invisible -translate-y-2 py-1.5 opacity-0",
          )}
        >
          <Link
            href="/"
            className="font-editorial shrink-0 text-[0.95rem] tracking-wide text-charcoal md:text-base"
            tabIndex={showCompact ? 0 : -1}
          >
            ბოლო ზარი
          </Link>

          <NavLinks
            className="hidden items-center gap-0.5 lg:flex"
            linkClassName="nav-link-glow rounded-full px-2.5 py-1.5 text-[0.7rem] tracking-wide text-charcoal-soft transition-colors duration-300 hover:bg-white/45 hover:text-charcoal"
            onNavigate={() => setMenuOpen(false)}
          />

          <button
            type="button"
            className="rounded-full border border-charcoal/10 bg-white/50 px-3 py-1.5 text-[0.7rem] tracking-wide text-charcoal lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            tabIndex={showCompact ? 0 : -1}
            onClick={toggleMenu}
          >
            {menuOpen ? "დახურვა" : "მენიუ"}
          </button>
        </nav>
      </header>

      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-40 bg-ivory/96 px-6 pt-28 backdrop-blur-md transition duration-400 lg:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <NavLinks
          className="flex flex-col gap-2"
          linkClassName="block rounded-[1.5rem] border border-charcoal/8 bg-white/55 px-5 py-4 font-editorial text-2xl text-charcoal"
          onNavigate={() => setMenuOpen(false)}
        />
      </div>
    </>
  );
}
