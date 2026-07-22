"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useCommunity } from "@/components/community/CommunityProvider";
import { getCommunityAvatarPath } from "@/lib/community/avatars";
import {
  useDraggablePosition,
  type WindowPosition,
} from "./useDraggablePosition";
import { useFeedbackCarousel } from "./useFeedbackCarousel";

const positionStorageKey = "rafaelos.widget.feedback.position.v1";

const getDefaultPosition = (): WindowPosition => {
  if (typeof window === "undefined") return { x: 13, y: 0 };

  const rootFontSize =
    Number.parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    ) || 16;

  return {
    x: 0.8 * rootFontSize,
    y: Math.max(0, window.innerHeight - 16.9 * rootFontSize),
  };
};

export function CommunityWidget({ onOpen }: { onOpen: () => void }) {
  const { feedback, loading, pendingMessages, visitorCount } = useCommunity();
  const [isPaused, setIsPaused] = useState(false);
  const { position, handlePointerDown, handlePointerMove, handlePointerUp } =
    useDraggablePosition({
      defaultPosition: getDefaultPosition,
      storageKey: positionStorageKey,
    });
  const { activeMessage, messages, safeActiveIndex, showNext, showPrevious } =
    useFeedbackCarousel({
      approvedMessages: feedback,
      isPaused,
      loading,
      pendingMessages,
    });

  const style = {
    left: position.x,
    top: position.y,
    bottom: "auto",
  } as CSSProperties;

  return (
    <aside
      className="community-widget"
      aria-label="Feedback da comunidade"
      style={style}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsPaused(false);
      }}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <header
        className="title-bar community-widget__titlebar"
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span>Feedback</span>
        <strong
          aria-label={
            messages.length
              ? `Mensagem ${safeActiveIndex + 1} de ${messages.length}`
              : "Nenhuma mensagem"
          }
        >
          {messages.length
            ? `${String(safeActiveIndex + 1).padStart(2, "0")}/${String(messages.length).padStart(2, "0")}`
            : "--/--"}
        </strong>
      </header>

      <div
        className="community-widget__message"
        aria-live={isPaused ? "polite" : "off"}
      >
        {activeMessage ? (
          <blockquote>
            <p>“{activeMessage.message}”</p>
            <footer>
              <span className="community-widget__author">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src={getCommunityAvatarPath(activeMessage.avatarId)}
                  unoptimized
                  width={24}
                />
                <strong>{activeMessage.name}</strong>
              </span>
              {activeMessage.status === "pending" ? (
                <span>Aguardando aprovação</span>
              ) : null}
            </footer>
          </blockquote>
        ) : (
          <div className="community-widget__empty">
            <strong>
              {loading
                ? "Carregando mensagens..."
                : "Nenhuma mensagem publicada"}
            </strong>
            <span>Envie o primeiro feedback.</span>
          </div>
        )}
      </div>

      <footer className="community-widget__footer">
        <div className="community-widget__controls">
          <button
            aria-label="Feedback anterior"
            disabled={messages.length <= 1}
            type="button"
            onClick={showPrevious}
          >
            <ChevronLeft aria-hidden="true" size={17} />
          </button>
          <button
            aria-label="Próximo feedback"
            disabled={messages.length <= 1}
            type="button"
            onClick={showNext}
          >
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        </div>
        <span>{visitorCount.toLocaleString("pt-BR")} visitantes</span>
        <button
          className="community-widget__open"
          type="button"
          onClick={onOpen}
        >
          Enviar feedback
        </button>
      </footer>
    </aside>
  );
}
