"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCommunity } from "@/components/community/CommunityProvider";
import { getCommunityAvatarPath } from "@/lib/community/avatars";

export function CommunityWidget({ onOpen }: { onOpen: () => void }) {
  const { loading, messages, visitorCount } = useCommunity();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const safeActiveIndex = messages.length ? activeIndex % messages.length : 0;
  const activeMessage = messages[safeActiveIndex];

  useEffect(() => {
    if (messages.length <= 1 || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length);
    }, 7_000);

    return () => window.clearInterval(timer);
  }, [isPaused, messages.length]);

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + messages.length) % messages.length,
    );
  };
  const showNext = () => {
    setActiveIndex((current) => (current + 1) % messages.length);
  };

  return (
    <aside
      className="community-widget"
      aria-label="Feedback da comunidade"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsPaused(false);
      }}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <header className="community-widget__titlebar">
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
