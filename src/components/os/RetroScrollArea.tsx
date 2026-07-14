"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RetroScrollAreaProps = {
  children: ReactNode;
  ariaLabel: string;
};

export function RetroScrollArea({ children, ariaLabel }: RetroScrollAreaProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ top: 0, ratio: 1 });

  const updateScrollState = () => {
    const element = contentRef.current;
    if (!element) return;

    const maxScroll = Math.max(1, element.scrollHeight - element.clientHeight);

    setScrollState({
      top: element.scrollTop / maxScroll,
      ratio: Math.min(1, element.clientHeight / Math.max(1, element.scrollHeight)),
    });
  };

  const scrollBy = (amount: number) => {
    contentRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);

    if (element.firstElementChild) {
      observer.observe(element.firstElementChild);
    }

    return () => observer.disconnect();
  }, [children]);

  const thumbHeight = Math.max(18, scrollState.ratio * 100);
  const thumbTop = scrollState.top * (100 - thumbHeight);
  const hasOverflow = scrollState.ratio < 0.995;

  return (
    <div
      className={
        hasOverflow
          ? "retro-scroll-area retro-scroll-area--has-overflow"
          : "retro-scroll-area"
      }
    >
      <div
        aria-label={ariaLabel}
        className="retro-scroll-area__content"
        onScroll={updateScrollState}
        ref={contentRef}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="retro-scrollbar retro-scroll-area__bar" aria-label={`Rolagem de ${ariaLabel}`}>
        <button aria-label={`Subir ${ariaLabel}`} type="button" onClick={() => scrollBy(-120)}>
          ▲
        </button>
        <div className="retro-scrollbar__track">
          <span
            className="retro-scrollbar__thumb"
            style={{
              height: `${thumbHeight}%`,
              top: `${thumbTop}%`,
            }}
          />
        </div>
        <button aria-label={`Descer ${ariaLabel}`} type="button" onClick={() => scrollBy(120)}>
          ▼
        </button>
      </div>
    </div>
  );
}
