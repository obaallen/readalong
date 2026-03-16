/**
 * Scroll manager: given "current chunk" element, scroll it into view (center preferred).
 * Single source of truth—only current chunk drives scroll. Interface only; app injects scroll target.
 */

export interface ScrollTarget {
  scrollIntoView(opts?: { block?: "center" | "start" | "end" }): void;
}

export function createScrollManager(
  getScrollTarget: () => ScrollTarget | null
): { scrollToCurrent: () => void } {
  return {
    scrollToCurrent() {
      const target = getScrollTarget();
      if (!target) return;
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: "center" });
        });
      } else {
        target.scrollIntoView({ block: "center" });
      }
    },
  };
}
