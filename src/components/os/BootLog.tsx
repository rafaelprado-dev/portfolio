"use client";

import { useEffect, useRef, useState } from "react";

type BootLogProps = {
  logs: string[];
};

export function BootLog({ logs }: BootLogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ top: 0, ratio: 1 });

  const updateScrollState = () => {
    const element = contentRef.current;
    if (!element) return;

    const maxScroll = Math.max(1, element.scrollHeight - element.clientHeight);
    setScrollState({
      top: element.scrollTop / maxScroll,
      ratio: Math.min(1, element.clientHeight / Math.max(1, element.scrollHeight))
    });
  };

  const scrollBy = (amount: number) => {
    contentRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
    updateScrollState();
  }, [logs]);

  const thumbHeight = Math.max(18, scrollState.ratio * 100);
  const thumbTop = scrollState.top * (100 - thumbHeight);

  return (
    <div className="boot-log">
      <div
        aria-label="Arquivos carregados pelo RafaelOS"
        className="boot-log__content"
        onScroll={updateScrollState}
        ref={contentRef}
        role="log"
        tabIndex={0}
      >
        {logs.map((message) => (
          <p className="boot-log__line" key={message}>
            <span className="boot-log__bullet" aria-hidden="true" />
            <span>{message}</span>
          </p>
        ))}
      </div>

      <div className="retro-scrollbar" aria-label="Controles de rolagem do log">
        <button aria-label="Subir log" type="button" onClick={() => scrollBy(-100)}>
          ▲
        </button>
        <div className="retro-scrollbar__track">
          <span
            className="retro-scrollbar__thumb"
            style={{
              height: `${thumbHeight}%`,
              top: `${thumbTop}%`
            }}
          />
        </div>
        <button aria-label="Descer log" type="button" onClick={() => scrollBy(100)}>
          ▼
        </button>
      </div>
    </div>
  );
}
