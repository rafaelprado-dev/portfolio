import Link from "next/link";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seo";

type SeoRoutePageProps = {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
};

const routeLinks = [
  { href: "/", label: "RafaelOS" },
  { href: "/projetos", label: "Projetos" },
  { href: "/habilidades", label: "Habilidades" },
  { href: "/experiencia", label: "Experiência" },
  { href: "/contato", label: "Contato" },
  { href: "/curriculo", label: "Currículo" },
];

export function SeoRoutePage({
  kicker,
  title,
  description,
  children,
}: SeoRoutePageProps) {
  return (
    <main className="seo-route-page">
      <header>
        <Link href="/" aria-label="Voltar para RafaelOS em rafaelprado.dev">
          rafaelprado.dev
        </Link>
        <nav aria-label="Navegação pública do portfólio">
          {routeLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="seo-route-page__hero">
        <p>{kicker}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </section>

      <div className="seo-route-page__content">{children}</div>

      <footer>
        <span>Canonical: {siteUrl}</span>
        <Link href="/">Abrir experiência RafaelOS</Link>
      </footer>
    </main>
  );
}
