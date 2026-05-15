# SEO Setup

Este projeto está preparado para usar `https://rafaelprado.dev` como domínio canônico do portfólio profissional de Rafael Prado.

## Pós-deploy na Vercel

1. Configure o domínio principal na Vercel:
   - `rafaelprado.dev`
   - redirecione `www.rafaelprado.dev` para `rafaelprado.dev`.

2. Confirme que as URLs públicas respondem com HTTPS:
   - `https://rafaelprado.dev`
   - `https://rafaelprado.dev/robots.txt`
   - `https://rafaelprado.dev/sitemap.xml`
   - `https://rafaelprado.dev/opengraph-image`
   - `https://rafaelprado.dev/twitter-image`

3. Adicione uma propriedade de domínio no Google Search Console:
   - propriedade: `rafaelprado.dev`
   - método recomendado: verificação por DNS TXT.

4. Na Cloudflare ou no provedor de DNS:
   - crie o registro TXT informado pelo Google Search Console;
   - aguarde a propagação;
   - conclua a verificação.

5. Envie o sitemap no Google Search Console:
   - `https://rafaelprado.dev/sitemap.xml`

6. Use a inspeção de URL para:
   - `https://rafaelprado.dev`
   - solicite indexação após o deploy final.

7. Valide arquivos técnicos:
   - `robots.txt` deve permitir `User-Agent: *` e apontar para o sitemap;
   - `sitemap.xml` deve listar apenas URLs públicas válidas;
   - canonical deve apontar sempre para `https://rafaelprado.dev`.

8. Teste dados estruturados:
   - use a ferramenta oficial de Rich Results do Google;
   - confirme os schemas `Person`, `WebSite` e `ProfilePage`.

## Analytics

Vercel Analytics e Vercel Speed Insights já estão configurados no layout raiz.

Google Analytics 4 é opcional. Para ativar:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Se a variável não existir, nenhum script do Google Analytics é carregado.

## Validação antes de publicar

Execute:

```bash
npm run lint
npm run build
```

Depois do deploy, rode Lighthouse e valide:

- Performance
- Accessibility
- Best Practices
- SEO

## Observações

- Não há promessa de ranqueamento no topo do Google.
- A implementação cobre boas práticas técnicas de indexação, metadados, Open Graph, Twitter Card, canonical, sitemap, robots, JSON-LD e performance.
- O domínio `.vercel.app` não deve ser divulgado como principal. O canonical público permanece `https://rafaelprado.dev`.
