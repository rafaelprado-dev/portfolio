"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { RetroScrollArea } from "@/components/os/RetroScrollArea";

type WindowPosition = {
  x: number;
  y: number;
};

type WindowFrameProps = {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  defaultPosition: WindowPosition;
  scrollable?: boolean;
  storageKey: string;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const readStoredPosition = (storageKey: string) => {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as Partial<WindowPosition> | null;

    if (typeof parsed?.x !== "number" || typeof parsed.y !== "number") {
      return null;
    }

    return parsed as WindowPosition;
  } catch {
    return null;
  }
};

export function WindowFrame({
  title,
  children,
  className,
  bodyClassName,
  defaultPosition,
  scrollable = false,
  storageKey,
  zIndex,
  onClose,
  onFocus,
  onMinimize,
}: WindowFrameProps) {
  const [position, setPosition] = useState(() => readStoredPosition(storageKey) ?? defaultPosition);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".title-bar-controls")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    onFocus();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const nextX = drag.originX + event.clientX - drag.startX;
    const nextY = drag.originY + event.clientY - drag.startY;

    setPosition({
      x: clamp(nextX, 0, window.innerWidth - 220),
      y: clamp(nextY, 0, window.innerHeight - 80),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (drag?.pointerId === event.pointerId) {
      const finalPosition = {
        x: clamp(drag.originX + event.clientX - drag.startX, 0, window.innerWidth - 220),
        y: clamp(drag.originY + event.clientY - drag.startY, 0, window.innerHeight - 80),
      };

      setPosition(finalPosition);
      window.localStorage.setItem(storageKey, JSON.stringify(finalPosition));
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const style = {
    "--window-x": `${position.x}px`,
    "--window-y": `${position.y}px`,
    zIndex,
  } as CSSProperties;

  return (
    <section
      aria-label={title}
      className={cn("window os-window", className)}
      onPointerDown={onFocus}
      style={style}
    >
      <div
        className="title-bar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button
            aria-label={`Minimizar ${title}`}
            className="window-control window-control--minimize"
            type="button"
            onClick={onMinimize}
          />
          <button
            aria-label={`Fechar ${title}`}
            className="window-control window-control--close"
            type="button"
            onClick={onClose}
          />
        </div>
      </div>
      <div
        className={cn(
          "window-body",
          bodyClassName ?? "os-window__body",
          scrollable && "window-body--scrollable",
        )}
      >
        {scrollable ? (
          <RetroScrollArea ariaLabel={`${title} conteúdo`}>{children}</RetroScrollArea>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
