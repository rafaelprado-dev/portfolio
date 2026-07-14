import { profile } from "@/content/profile";
import { socialLinks } from "@/content/socialLinks";

export function ContactApp() {
  return (
    <section className="app-screen contact-app" aria-labelledby="contact-title">
      <p className="app-kicker">/contato.terminal</p>
      <h2 id="contact-title">Contato</h2>

      <div className="contact-app__terminal">
        <div className="contact-app__status">
          <span aria-hidden="true" />
          <div>
            <strong>Canal aberto</strong>
          </div>
        </div>

        <p>
          Para iniciar uma conversa profissional, utilize um dos canais
          verificados abaixo.
        </p>

        <section aria-labelledby="contact-protocols-title">
          <h3 id="contact-protocols-title">Protocolos</h3>
          <div className="contact-app__links">
            {socialLinks.map((link) => (
              <a
                aria-label={link.ariaLabel}
                href={link.href}
                key={link.href}
                rel="noreferrer noopener"
                target="_blank"
                title={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <address aria-label="Localização profissional">
          <span className="contact-app__contact-line">
            <span>{profile.location}</span>
          </span>
        </address>
      </div>
    </section>
  );
}
