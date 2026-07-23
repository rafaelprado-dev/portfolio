import { ContactForm } from "@/components/contact/ContactForm";
import { profile } from "@/content/profile";
import { socialLinks } from "@/content/socialLinks";

export function MobileContactApp() {
  return (
    <div className="mobile-app mobile-contact-app">
      <header className="mobile-app__hero mobile-app__hero--compact">
        <h2>Vamos conversar</h2>
        <p>{profile.availability}</p>
      </header>

      <section
        className="mobile-app__section mobile-contact-app__form"
        aria-label="Formulário de contato"
      >
        <ContactForm variant="mobile" />
      </section>

      <section
        className="mobile-app__section"
        aria-labelledby="contact-protocols"
      >
        <h3 id="contact-protocols">Outros canais</h3>
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

      <section
        className="mobile-app__section"
        aria-labelledby="contact-location"
      >
        <h3 id="contact-location">Localização</h3>
        <p>{profile.location}</p>
      </section>
    </div>
  );
}
