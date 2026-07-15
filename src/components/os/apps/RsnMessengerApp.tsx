"use client";

import Image from "next/image";
import { MessageCircleMore, SendHorizontal } from "lucide-react";
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

export function RsnMessengerApp() {
  const { messages, visitorCount } = useCommunity();
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
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = historyRef.current;

    if (history) history.scrollTop = history.scrollHeight;
  }, [messages.length]);

  return (
    <div className="rsn-messenger">
      <header className="rsn-messenger__contact">
        <Image
          alt=""
          aria-hidden="true"
          className="rsn-messenger__contact-avatar"
          height={58}
          src={profile.avatarUrl}
          width={58}
        />
        <div className="rsn-messenger__contact-copy">
          <strong>
            Rafael Prado
            <span className="rsn-messenger__online-dot">
              <span className="sr-only">Online</span>
            </span>
          </strong>
          <small>
            Envie uma mensagem sobre meu trabalho, um elogio ou uma sugestão
            para o portfólio
          </small>
        </div>
        <div
          className="rsn-messenger__brand"
          aria-label="Rafael System Network Messenger"
        >
          <MessageCircleMore aria-hidden="true" size={24} strokeWidth={1.8} />
          <span>
            <b>RSN</b> Messenger
          </span>
        </div>
      </header>

      <section
        className="rsn-messenger__conversation"
        aria-label="Conversa com Rafael Prado"
      >
        <div
          className="rsn-messenger__history"
          aria-live="polite"
          ref={historyRef}
        >
          <article className="rsn-message rsn-message--received">
            <Image
              alt=""
              aria-hidden="true"
              className="rsn-message__contact-avatar"
              height={34}
              src={profile.avatarUrl}
              width={34}
            />
            <div>
              <strong>Rafael Prado diz:</strong>
              <p>{feedbackWelcomeMessage}</p>
            </div>
          </article>

          {chronologicalMessages.map((item) => (
            <article className="rsn-message rsn-message--sent" key={item.id}>
              <Image
                alt=""
                aria-hidden="true"
                height={34}
                src={getCommunityAvatarPath(item.avatarId)}
                unoptimized
                width={34}
              />
              <div>
                <strong>{item.name} diz:</strong>
                <p>{item.message}</p>
                {item.status === "pending" ? (
                  <small>Aguardando aprovação</small>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <aside
          className="rsn-messenger__profile"
          aria-label="Sua identidade no RSN"
        >
          <button
            aria-label={
              displayAvatarId
                ? "Trocar imagem de perfil"
                : "Escolher imagem de perfil"
            }
            className="rsn-messenger__sender-avatar"
            title={
              displayAvatarId
                ? "Trocar imagem de perfil"
                : "Escolher imagem de perfil"
            }
            type="button"
            onClick={changeDisplayAvatar}
          >
            {displayAvatarId ? (
              <Image
                alt=""
                aria-hidden="true"
                height={82}
                src={getCommunityAvatarPath(displayAvatarId)}
                unoptimized
                width={82}
              />
            ) : (
              <span aria-hidden="true">?</span>
            )}
          </button>
          <strong>{displayName || "Seu nome"}</strong>
          <span>
            {displayAvatarId
              ? "Clique na imagem para alterar seu perfil."
              : "Digite um apelido para escolher sua imagem."}
          </span>
        </aside>
      </section>

      <form className="rsn-messenger__composer" onSubmit={handleSubmit}>
        <div className="rsn-messenger__identity-field">
          <label htmlFor="rsn-display-name">Nome de exibição:</label>
          <input
            autoComplete="nickname"
            id="rsn-display-name"
            maxLength={32}
            placeholder="Escolha um apelido ou nome fictício favorito"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>

        <div className="rsn-messenger__compose-toolbar">
          <TextEmoticonPicker onSelect={appendToMessage} />
          <span>{message.length}/500</span>
        </div>

        <div className="rsn-messenger__compose-row">
          <label className="sr-only" htmlFor="rsn-message">
            Mensagem
          </label>
          <textarea
            id="rsn-message"
            maxLength={500}
            minLength={10}
            placeholder={feedbackMessagePlaceholder}
            required
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button disabled={status.type === "submitting"} type="submit">
            <SendHorizontal aria-hidden="true" size={18} />
            {status.type === "submitting" ? "Enviando..." : "Enviar"}
          </button>
        </div>

        <footer className="rsn-messenger__statusbar">
          <p className={`is-${status.type}`} aria-live="polite" role="status">
            {status.type === "success" || status.type === "error"
              ? status.message
              : "A mensagem fica visível somente neste navegador até ser aprovada."}
          </p>
          <span>{visitorCount.toLocaleString("pt-BR")} visitantes</span>
        </footer>
      </form>
    </div>
  );
}
