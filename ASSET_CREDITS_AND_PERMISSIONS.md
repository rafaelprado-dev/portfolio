# Asset Credits and Permissions

Este arquivo registra assets, fontes, bibliotecas visuais e referências externas usadas no portfólio.

## Assets Usados

| Asset | Arquivo/Uso | Fonte | Autor/Criador | Licença | Status | Observação |
|---|---|---|---|---|---|---|
| Open Peeps avatar via DiceBear | `public/assets/open-peeps-rafael.svg` | https://www.dicebear.com/styles/open-peeps/ | Open Peeps por Pablo Stanley; DiceBear | CC0 1.0 para o estilo Open Peeps; DiceBear code MIT | OK | Usado como ilustração editorial. Fonte consultada em 2026-05-05. |
| Space Grotesk | `src/app/layout.tsx` via `next/font/google` | Google Fonts / https://fonts.google.com/specimen/Space+Grotesk | Florian Karsten | SIL Open Font License 1.1 | OK | Fonte principal de interface. |
| Cormorant Garamond | `src/app/layout.tsx` via `next/font/google` | Google Fonts / https://fonts.google.com/specimen/Cormorant+Garamond | Christian Thalmann / Catharsis Fonts | SIL Open Font License 1.1 | OK | Fonte editorial do hero e headings especiais. |
| Lucide icons | Componentes de UI e seções | https://lucide.dev/ | Lucide contributors | ISC License | OK | Ícones de navegação, links e detalhes de interface. |
| 98.css | Referência visual de janelas/botões do RafaelOS | https://github.com/jdan/98.css | Jordan Scales / contributors | MIT License | OK | Consultado como referência para estética Windows 98. A implementação final usa CSS próprio para evitar dependência e warning de build. Versão npm consultada: `98.css@0.1.21`. |
| W95FA | `public/fonts/w95fa/*` / fonte principal do RafaelOS | Fonte adicionada localmente pelo projeto | W95FA font package | SIL Open Font License 1.1 conforme `public/fonts/w95fa/OFL.txt` | OK | Usada para reforçar estética Windows 95/98. |
| Árvore pixelada do RafaelOS | `public/assets/icons/skills-tree-pixel.png` | Arquivo local fornecido pelo Rafael | Rafael Prado / origem final a confirmar | A confirmar | permission_required | Usado como ícone do atalho `habilidades.tree`. |
| Windows 7 Live Green Cursor Set | `public/assets/cursors/windows-7-live-green/*` | http://www.rw-designer.com/cursor-set/windows-7-live-green | Cursor Mania | Custom, uso pessoal não comercial; outros usos exigem permissão | permission_required | Cursores renomeados para estados previsíveis (`default.cur`, `pointer.cur`, `move.cur`, etc.). O readme original foi preservado na pasta. |
| Wallpapers adicionados pelo Rafael | `public/assets/wallpapers/*.webp` | Arquivos locais fornecidos pelo Rafael | Origem final a confirmar | A confirmar | permission_required | Usados como opções de fundo no RafaelOS. Antes de deploy público, confirmar autor/licença de cada imagem. |
| DOOM icon set | `public/assets/icons/doom/*.png` | Arquivos locais fornecidos pelo Rafael | Origem final a confirmar | A confirmar | permission_required | Usado como ícone do atalho `doom.exe`. Os arquivos foram renomeados por tamanho (`doom-64.png`, etc.). |
| DOOM Shareware embed | Janela `doom.exe` via iframe | https://archive.org/embed/DoomsharewareEpisode | id Software / Internet Archive item | Conteúdo externo incorporado; confirmar condições de uso antes de publicar | permission_required | O portfólio não empacota WAD/engine localmente; apenas incorpora o player externo em sandbox. |
| GitHub avatar público | `src/content/profile.ts` / Hero | https://github.com/rafaelprado-dev.png | Rafael Prado / GitHub | Próprio perfil público | OK | Usado como avatar de contato/perfil quando necessário. |

## Assets Criados no Projeto

| Asset | Arquivo/Uso | Licença/Status |
|---|---|---|
| Interface RafaelOS, janelas, atalhos e terminal | `src/components/os/*`, `src/styles/*` | Criado para este projeto |
| Texturas, scanlines, efeitos CRT e estados de desktop | `src/app/globals.css`, `src/styles/*` | Criado para este projeto |
| Favicon RP | `public/favicon.svg` | Criado para este projeto |
