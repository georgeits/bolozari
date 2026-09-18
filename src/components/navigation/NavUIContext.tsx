"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";

type NavUIContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  compact: boolean;
};

const NavUIContext = createContext<NavUIContextValue | null>(null);

function subscribeMasthead(onChange: () => void) {
  const onScroll = () => onChange();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

function getMastheadPassed(): boolean {
  const sentinel = document.getElementById("nav-sentinel");
  if (!sentinel) return true;
  return sentinel.getBoundingClientRect().top < 0;
}

function getMastheadServerSnapshot() {
  return false;
}

export function NavUIProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mastheadPassed = useSyncExternalStore(
    subscribeMasthead,
    getMastheadPassed,
    getMastheadServerSnapshot,
  );

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const compact = pathname !== "/" || mastheadPassed;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const value = useMemo(
    () => ({ menuOpen, setMenuOpen, toggleMenu, compact }),
    [menuOpen, toggleMenu, compact],
  );

  return (
    <NavUIContext.Provider value={value}>{children}</NavUIContext.Provider>
  );
}

export function useNavUI() {
  const ctx = useContext(NavUIContext);
  if (!ctx) throw new Error("useNavUI must be used within NavUIProvider");
  return ctx;
}
