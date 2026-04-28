import { useCallback, useEffect, useRef, useState } from "react";
import type { TocEntry } from "../types";

/** Walk up the DOM tree to find the nearest scrollable ancestor. */
function findScrollContainer(el: Element): Element | null {
  let current = el.parentElement;
  while (current) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Find the last heading whose top edge is at or above 40% of the container's
 * visible height. This reliably identifies the current section even when the
 * user reaches the bottom of the document.
 */
function getActiveHeadingByScroll(container: Element, headingIds: string[]): string | null {
  const containerRect = container.getBoundingClientRect();
  const cutoff = containerRect.top + containerRect.height * 0.4;
  let lastAbove: string | null = null;

  for (const id of headingIds) {
    const el = document.getElementById(id);
    if (!el) {
      continue;
    }
    if (el.getBoundingClientRect().top <= cutoff) {
      lastAbove = id;
    }
  }

  return lastAbove;
}

/** Track which heading is currently in view. */
export function useTableOfContents(headings: TocEntry[]) {
  const [activeId, setActiveId] = useState<string>("");
  const scrollRootRef = useRef<Element | null>(null);
  const handleScrollRef = useRef<(() => void) | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (programmaticScrollTimeoutRef.current !== null) {
      window.clearTimeout(programmaticScrollTimeoutRef.current);
      programmaticScrollTimeoutRef.current = null;
    }

    if (headings.length === 0) {
      setActiveId("");
      return;
    }

    const headingIds = headings.map((heading) => heading.id);
    const firstEl = document.getElementById(headingIds[0]);
    const scrollRoot = firstEl ? findScrollContainer(firstEl) : null;
    scrollRootRef.current = scrollRoot;

    const updateActiveHeading = () => {
      if (!scrollRoot) {
        setActiveId(headingIds[0] ?? "");
        return;
      }
      const active = getActiveHeadingByScroll(scrollRoot, headingIds);
      setActiveId(active ?? headingIds[0] ?? "");
    };

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        updateActiveHeading();
      });
    };
    handleScrollRef.current = handleScroll;

    updateActiveHeading();
    scrollRoot?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollRootRef.current && handleScrollRef.current) {
        scrollRootRef.current.removeEventListener("scroll", handleScrollRef.current);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      handleScrollRef.current = null;
      scrollRootRef.current = null;
    };
  }, [headings]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current !== null) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    setActiveId(id);
    isProgrammaticScrollRef.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    if (programmaticScrollTimeoutRef.current !== null) {
      window.clearTimeout(programmaticScrollTimeoutRef.current);
    }

    programmaticScrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      programmaticScrollTimeoutRef.current = null;
    }, 600);
  }, []);

  return { activeId, scrollToHeading };
}
