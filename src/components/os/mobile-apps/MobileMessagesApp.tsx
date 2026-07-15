"use client";

import Image from "next/image";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { TextEmoticonPicker } from "@/components/community/TextEmoticonPicker";
import { useCommunity } from "@/components/community/CommunityProvider";
import { useFeedbackComposer } from "@/components/community/useFeedbackComposer";
import { profile } from "@/content/profile";
import { getCommunityAvatarPath } from "@/lib/community/avatars";
import {
  feedbackMessagePlaceholder,
  feedbackWelcomeMessage,
} from "@/lib/community/copy";

export function MobileMessagesApp() {
  const { messages } = useCommunity();
  const {
    appendToMessage,
    changeDisplayAvatar,
    displayAvatarId,
    displayName,
    handleSubmit,
    message,
    setDisplayName,
    setMessage,
    status,
  } = useFeedbackComposer();
  const chronologicalMessages = [...messages].sort((first, second) =>
    first.createdAt.localeCompare(second.createdAt),
  );
  const threadRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const thread = threadRef.current;

    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages.length]);

  return (
    <div className="mobile-app mobile-messages-app">
      <header className="mobile-messages-app__contact">
        <Image
          alt=""
          aria-hidden="true"
          className="mobile-messages-app__contact-avatar"
          height={42}
          src={profile.avatarUrl}
          width={42}
        />
        <div>
          <h2>{profile.name}</h2>
          <span>Canal de feedback</span>
        </div>
        <small>SMS</small>
      </header>

      <section
        className="mobile-messages-app__thread"
        aria-label="Conversa com Rafael Prado"
        ref={threadRef}
      >
        <time>Hoje</time>
        <article className="mobile-message mobile-message--received">
          <p>{feedbackWelcomeMessage}</p>
          <small>agora</small>
        </article>

        {chronologicalMessages.map((item) => (
          <article
            className="mobile-message mobile-message--sent"
            key={item.id}
          >
            <p>{item.message}</p>
            <footer>
              <Image
                alt=""
                aria-hidden="true"
                height={20}
                src={getCommunityAvatarPath(item.avatarId)}
                unoptimized
                width={20}
              />
              <span>
                {item.name}
                {item.status === "pending" ? " · aguardando aprovação" : ""}
              </span>
            </footer>
          </article>
        ))}
      </section>

      <form className="mobile-messages-app__composer" onSubmit={handleSubmit}>
        <div className="mobile-messages-app__identity">
          <span>De</span>
          <button
            aria-label={
              displayAvatarId
                ? "Trocar imagem de perfil"
                : "Escolher imagem de perfil"
            }
            className="mobile-messages-app__sender-avatar"
            type="button"
            onClick={changeDisplayAvatar}
          >
            {displayAvatarId ? (
              <Image
                alt=""
                aria-hidden="true"
                height={34}
                src={getCommunityAvatarPath(displayAvatarId)}
                unoptimized
                width={34}
              />
            ) : (
              <span aria-hidden="true">?</span>
            )}
          </button>
          <div>
            <label className="sr-only" htmlFor="mobile-message-name">
              Nome de exibição
            </label>
            <input
              autoComplete="nickname"
              id="mobile-message-name"
              maxLength={32}
              placeholder="Escolha um apelido ou nome fictício favorito"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
            <small>
              {displayAvatarId
                ? "Toque na imagem para alterar seu perfil."
                : "Digite um apelido para escolher sua imagem."}
            </small>
          </div>
        </div>

        <TextEmoticonPicker
          className="mobile-messages-app__emoticons"
          onSelect={appendToMessage}
        />

        <div className="mobile-messages-app__compose-row">
          <label className="sr-only" htmlFor="mobile-message-text">
            Mensagem
          </label>
          <textarea
            id="mobile-message-text"
            maxLength={500}
            minLength={10}
            placeholder={feedbackMessagePlaceholder}
            required
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            aria-label={
              status.type === "submitting"
                ? "Enviando mensagem"
                : "Enviar mensagem"
            }
            className="mobile-messages-app__send"
            disabled={status.type === "submitting"}
            type="submit"
          >
            <SendHorizontal aria-hidden="true" size={19} />
          </button>
        </div>

        <footer>
          <span>{message.length}/500</span>
          <p className={`is-${status.type}`} aria-live="polite" role="status">
            {status.type === "success" || status.type === "error"
              ? status.message
              : "Publicada após aprovação."}
          </p>
        </footer>
      </form>
    </div>
  );
}
