"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { socialLinks } from "@/content/socialLinks";
import type { SocialLink } from "@/types/portfolio";

type CopiedContact = "email" | "phone" | null;

export function ContactApp() {
  const [copiedContact, setCopiedContact] = useState<CopiedContact>(null);
  const phoneHref = `tel:${profile.phone.replace(/\D/g, "")}`;
  const protocolLinks = socialLinks.filter((link) => link.kind !== "email");

  const shouldOpenInNewTab = (link: SocialLink) => {
    return link.href.startsWith("http") || link.kind === "resume";
  };

  const handleCopy = async (
    value: string,
    contact: Exclude<CopiedContact, null>,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedContact(contact);
      window.setTimeout(() => {
        setCopiedContact((current) => (current === contact ? null : current));
      }, 1600);
    } catch {
      setCopiedContact(null);
    }
  };

  return (
    <div className="app-screen contact-app">
      <p className="app-kicker">/contato.terminal</p>
      <h2>Contato</h2>

      <div className="contact-app__terminal">
        <div className="contact-app__status">
          <span aria-hidden="true" />
          <div>
            <strong>Canal aberto</strong>
          </div>
        </div>

        <p>
          Vamos conversar sobre interfaces modernas, produto, acessibilidade ou
          oportunidades em front-end.
        </p>

        <section aria-labelledby="contact-protocols-title">
          <h3 id="contact-protocols-title">Protocolos</h3>
          <div className="contact-app__links">
            {protocolLinks.map((link) => {
              const opensInNewTab = shouldOpenInNewTab(link);

              return (
                <a
                  aria-label={link.ariaLabel}
                  href={link.href}
                  key={link.href}
                  rel={opensInNewTab ? "noreferrer noopener" : undefined}
                  target={opensInNewTab ? "_blank" : undefined}
                  title={link.href}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </section>

        <address aria-label="Informações diretas de contato">
          <span className="contact-app__contact-line">
            <span>{profile.location}</span>
          </span>

          <span className="contact-app__contact-line">
            <a href={`mailto:${profile.email}`} title={profile.email}>
              {profile.email}
            </a>
            <button
              aria-label="Copiar e-mail"
              className={copiedContact === "email" ? "is-copied" : undefined}
              title="Copiar e-mail"
              type="button"
              onClick={() => handleCopy(profile.email, "email")}
            />
          </span>

          <span className="contact-app__contact-line">
            <a href={phoneHref} title={profile.phone}>
              {profile.phone}
            </a>
            <button
              aria-label="Copiar telefone"
              className={copiedContact === "phone" ? "is-copied" : undefined}
              title="Copiar telefone"
              type="button"
              onClick={() => handleCopy(profile.phone, "phone")}
            />
          </span>
        </address>
      </div>
    </div>
  );
}
