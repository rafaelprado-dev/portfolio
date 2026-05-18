import Link from "next/link";
import type { ReactNode } from "react";
import { RafaelOS, type AppId } from "@/components/os/RafaelOS";
import { siteUrl } from "@/lib/seo";

type SeoRoutePageProps = {
  initialApp: AppId;
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
  initialApp,
  kicker,
  title,
  description,
  children,
}: SeoRoutePageProps) {
  return (
    <>
      <section className="seo-content" aria-hidden="true" inert>
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

        <section aria-labelledby="seo-route-title">
          <p>{kicker}</p>
          <h1 id="seo-route-title">{title}</h1>
          <p>{description}</p>
        </section>

        <div>{children}</div>

        <footer>
          <span>Domínio: {siteUrl}</span>
          <Link href="/">Abrir experiência RafaelOS</Link>
        </footer>
      </section>

      <RafaelOS initialApp={initialApp} />
    </>
  );
}
