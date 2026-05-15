"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type DesktopIconKind =
  | "case"
  | "cmd"
  | "diagnostic"
  | "doom"
  | "folder"
  | "mission"
  | "pdf"
  | "shield"
  | "tree"
  | "wallpaper";

export type DesktopIconPosition = {
  x: number;
  y: number;
};

type DesktopIconProps = {
  label: string;
  kind?: DesktopIconKind;
  position: DesktopIconPosition;
  onMove: (position: DesktopIconPosition) => void;
  onMoveEnd: (position: DesktopIconPosition) => void;
  onOpen: () => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function DesktopIcon({
  label,
  kind = "folder",
  position,
  onMove,
  onMoveEnd,
  onOpen,
}: DesktopIconProps) {
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.moved = true;
    }

    const nextPosition = {
      x: clamp(drag.originX + deltaX, 8, window.innerWidth - 112),
      y: clamp(drag.originY + deltaY, 48, window.innerHeight - 116),
    };

    onMove(nextPosition);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const finalPosition = {
      x: clamp(drag.originX + event.clientX - drag.startX, 8, window.innerWidth - 112),
      y: clamp(drag.originY + event.clientY - drag.startY, 48, window.innerHeight - 116),
    };

    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (suppressClickRef.current) {
      onMove(finalPosition);
      onMoveEnd(finalPosition);
    }
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    onOpen();
  };

  return (
    <button
      className={cn("desktop-icon", `desktop-icon--${kind}`)}
      style={{ left: position.x, top: position.y }}
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span aria-hidden="true">
        {kind === "tree" ? (
          <Image
            alt=""
            aria-hidden="true"
            height={56}
            src="/assets/icons/skills-tree-pixel.png"
            width={56}
          />
        ) : null}
        {kind === "doom" ? (
          <Image
            alt=""
            aria-hidden="true"
            height={56}
            src="/assets/icons/doom/doom-64.png"
            width={56}
          />
        ) : null}
      </span>
      <strong>{label}</strong>
    </button>
  );
}
