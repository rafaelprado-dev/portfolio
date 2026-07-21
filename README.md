# RafaelOS Portfolio

Portfólio profissional, construído como uma experiência web interativa inspirada em sistemas operacionais retrô. O projeto apresenta perfil, projetos, habilidades, experiência e canais profissionais em uma interface desktop simulada.

## Visão Geral

O RafaelOS foi pensado para funcionar como portfólio e demonstração técnica ao mesmo tempo. A aplicação combina rotas estáticas em Next.js, componentes de interface reutilizáveis, SEO técnico, dados estruturados, manifesto PWA e assets locais cuidadosamente organizados.

## Stack

- Next.js
- React
- TypeScript
- Vercel Analytics
- Vercel Speed Insights
- ESLint

## Funcionalidades

- Desktop interativo com janelas, atalhos, barra de tarefas e boot screen.
- Seções profissionais para projetos, experiência, habilidades e contato.
- Metadados de SEO, sitemap, robots, Open Graph, Twitter image e JSON-LD.
- Assets locais com registro de créditos e permissões.
- Build estático otimizado para deploy na Vercel.

## Rodando Localmente

O ambiente local usa Firebase Authentication e Cloud Firestore Emulator com o projeto isolado `demo-portfolio`. Nenhuma credencial Firebase de produção é necessária. O Java 21 ou superior precisa estar instalado para iniciar os emuladores.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para executar os processos em terminais separados:

```bash
npm run dev:emulators
npm run dev:app
```

## Scripts

```bash
npm run dev
npm run dev:emulators
npm run lint
npm run build
npm run start
```

## Variáveis de Ambiente

Google Analytics é opcional. Quando `NEXT_PUBLIC_GA_ID` não estiver definida, nenhum script do GA é carregado.

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Qualidade

Antes de publicar uma alteração:

```bash
npm run lint
npm run build
```

O repositório também inclui GitHub Actions para validar lint e build em pushes e pull requests.

## Licença e Assets

Este é um portfólio pessoal source-available, com todos os direitos reservados. O código, identidade visual, textos e estrutura do projeto não podem ser copiados, redistribuídos ou reutilizados sem autorização prévia.

Consulte [LICENSE](LICENSE) e [ASSET_CREDITS_AND_PERMISSIONS.md](ASSET_CREDITS_AND_PERMISSIONS.md) para detalhes.
