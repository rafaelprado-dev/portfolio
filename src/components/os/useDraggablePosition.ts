"use client";

import { useRef, useState, type PointerEvent } from "react";

export type WindowPosition = {
  x: number;
  y: number;
};

type DraggablePositionOptions = {
  defaultPosition: WindowPosition | (() => WindowPosition);
  storageKey: string;
  onFocus?: () => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const readStoredPosition = (storageKey: string) => {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "null",
    ) as Partial<WindowPosition> | null;

    if (typeof parsed?.x !== "number" || typeof parsed.y !== "number") {
      return null;
    }

    return parsed as WindowPosition;
  } catch {
    return null;
  }
};

const resolveDefaultPosition = (
  defaultPosition: DraggablePositionOptions["defaultPosition"],
) => {
  return typeof defaultPosition === "function"
    ? defaultPosition()
    : defaultPosition;
};

export function useDraggablePosition({
  defaultPosition,
  storageKey,
  onFocus,
}: DraggablePositionOptions) {
  const [position, setPosition] = useState(
    () =>
      readStoredPosition(storageKey) ?? resolveDefaultPosition(defaultPosition),
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(".title-bar-controls")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
    onFocus?.();
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const nextX = drag.originX + event.clientX - drag.startX;
    const nextY = drag.originY + event.clientY - drag.startY;

    setPosition({
      x: clamp(nextX, 0, window.innerWidth - 220),
      y: clamp(nextY, 0, window.innerHeight - 80),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;

    if (drag?.pointerId !== event.pointerId) return;

    const finalPosition = {
      x: clamp(
        drag.originX + event.clientX - drag.startX,
        0,
        window.innerWidth - 220,
      ),
      y: clamp(
        drag.originY + event.clientY - drag.startY,
        0,
        window.innerHeight - 80,
      ),
    };

    setPosition(finalPosition);
    window.localStorage.setItem(storageKey, JSON.stringify(finalPosition));
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    position,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
