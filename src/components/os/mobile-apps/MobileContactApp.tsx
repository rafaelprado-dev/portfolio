import { profile } from "@/content/profile";
import { socialLinks } from "@/content/socialLinks";

export function MobileContactApp() {
  return (
    <div className="mobile-app mobile-contact-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <p className="mobile-app__kicker">Canal aberto</p>
        <h2>Canal aberto</h2>
        <p>{profile.availability}</p>
      </header>

      <section className="mobile-app__section" aria-labelledby="contact-protocols">
        <h3 id="contact-protocols">Protocolos</h3>
        <div className="mobile-app__actions mobile-app__actions--stack">
          {socialLinks.map((link) => (
            <a
              aria-label={link.ariaLabel}
              href={link.href}
              key={link.href}
              rel="noreferrer noopener"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mobile-app__section" aria-labelledby="contact-location">
        <h3 id="contact-location">Localização</h3>
        <dl className="mobile-app__definition-list">
          <div>
            <dt>Base profissional</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
