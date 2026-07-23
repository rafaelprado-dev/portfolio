"use client";

import { useCallback, useState } from "react";
import {
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactChannelStatus } from "@/components/contact/useContactForm";
import { profile } from "@/content/profile";
import { socialLinks } from "@/content/socialLinks";
import type { LinkKind } from "@/types/portfolio";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  external: ExternalLink,
} satisfies Record<LinkKind, LucideIcon>;

export function ContactApp() {
  const [channelStatus, setChannelStatus] = useState<ContactChannelStatus>({
    state: "checking",
    message: "Verificando disponibilidade...",
  });
  const handleChannelStatusChange = useCallback(
    (nextStatus: ContactChannelStatus) => setChannelStatus(nextStatus),
    [],
  );
  const statusLabel =
    channelStatus.state === "checking"
      ? "Verificando"
      : channelStatus.state === "available"
        ? "Disponível"
        : "Indisponível";

  return (
    <section className="app-screen contact-app" aria-labelledby="contact-title">
      <header className="contact-app__heading">
        <div>
          <p className="app-kicker">/contato.exe</p>
          <h2 id="contact-title">Contato</h2>
        </div>

        <nav
          className="contact-app__channels"
          aria-label="Canais profissionais"
        >
          <div className="contact-app__links">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.kind];

              return (
                <a
                  aria-label={link.ariaLabel}
                  href={link.href}
                  key={link.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  title={link.href}
                >
                  <Icon aria-hidden="true" size={19} />
                  <strong>{link.label}</strong>
                  <ExternalLink
                    aria-hidden="true"
                    className="contact-app__external-icon"
                    size={13}
                  />
                </a>
              );
            })}
          </div>

          <p className="contact-app__location">
            <MapPin aria-hidden="true" size={15} />
            {profile.location}
          </p>
        </nav>
      </header>

      <section
        className="contact-app__composer"
        aria-label="Formulário de contato"
      >
        <header>
          <div className={`contact-app__status is-${channelStatus.state}`}>
            <span aria-hidden="true" />
            <strong>{statusLabel}</strong>
          </div>
          <p>{channelStatus.message}</p>
        </header>
        <ContactForm
          onChannelStatusChange={handleChannelStatusChange}
          variant="desktop"
        />
      </section>
    </section>
  );
}
