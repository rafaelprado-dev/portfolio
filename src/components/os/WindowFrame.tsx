"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RetroScrollArea } from "@/components/os/RetroScrollArea";
import {
  useDraggablePosition,
  type WindowPosition,
} from "@/components/os/useDraggablePosition";

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
  const { position, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDraggablePosition({
      defaultPosition,
      storageKey,
      onFocus,
    });

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
          <RetroScrollArea ariaLabel={`${title} conteúdo`}>
            {children}
          </RetroScrollArea>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
