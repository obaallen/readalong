"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function AppShell({
  theme,
  rail,
  children,
  bottomBar,
}: {
  theme: "light" | "dark";
  rail: ReactNode;
  children: ReactNode;
  bottomBar: ReactNode;
}) {
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileRailOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-surface text-content-primary dark:bg-surface-dark dark:text-content-primary-dark">
        <div className="min-h-screen flex">
          <div className="hidden lg:block w-[280px] shrink-0 border-r border-border dark:border-border-dark bg-white/70 dark:bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-white/55 supports-[backdrop-filter]:dark:bg-zinc-950/30">
            <div className="h-screen sticky top-0">{rail}</div>
          </div>

          <main className="flex-1 min-w-0">
            <div className="min-h-screen pb-28">{children}</div>
          </main>
        </div>

        <button
          type="button"
          className="lg:hidden fixed left-4 top-4 z-30 rounded-2xl border border-border dark:border-border-dark bg-white/80 dark:bg-zinc-950/60 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label={mobileRailOpen ? "Close library" : "Open library"}
          onClick={() => setMobileRailOpen((v) => !v)}
        >
          {mobileRailOpen ? (
            <PanelLeftClose className="h-5 w-5" aria-hidden />
          ) : (
            <PanelLeftOpen className="h-5 w-5" aria-hidden />
          )}
        </button>

        {mobileRailOpen && (
          <div className="lg:hidden fixed inset-0 z-30">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              aria-label="Close library overlay"
              onClick={() => setMobileRailOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] border-r border-border dark:border-border-dark bg-white/90 dark:bg-zinc-950/70 backdrop-blur shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              {rail}
            </div>
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-20">{bottomBar}</div>
      </div>
    </div>
  );
}

