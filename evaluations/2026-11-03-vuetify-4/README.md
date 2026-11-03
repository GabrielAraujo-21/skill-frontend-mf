# Validação Vuetify 4 — 03/11/2026

Teste real da skill 2.0.0 em um projeto mínimo em JavaScript: Vue 3.5.44, Vuetify 4.3.1, Pinia 4.1.0, Vue Router 5.4.0, Axios 1.21.0 e Vite 8.3.5, com lockfile. Versões em [versoes.txt](evidencias/versoes.txt). Lint, Vitest e build rodaram em Node 24.22.2; o Chromium, na imagem `mcr.microsoft.com/playwright:v1.64.1-noble`, com Node 26.13.0.

## Resultados

| Verificação | Resultado |
|---|---|
| [ESLint](evidencias/lint.txt) | Aprovado |
| [Vitest](evidencias/vitest.txt) | 5 de 5 testes aprovados |
| [Build](evidencias/build.txt) | Aprovado: 201,58 kB e 255,69 kB de JS; 191,12 kB e 139,31 kB de CSS, antes do gzip |
| [`npm audit --omit=dev`](evidencias/audit-producao.txt) | 0 vulnerabilidades |
| [Playwright e Chromium](evidencias/playwright.txt) | 12 de 12 testes aprovados, sem retries, depois da correção abaixo |

Os testes no navegador confirmam, sobre o build de produção:

- `defaultTheme: 'system'` segue `prefers-color-scheme`, com axe sem violações nos temas claro e escuro e no estado de erro.
- As cascade layers ficam na ordem declarada em `public/layers.css`, e o utilitário `mb-4` continua valendo.
- O reset reduzido mantém a margem de `p`, botões não têm caixa alta e `text-headline-large` mede 32 px.
- Os pontos de quebra mudam em 840 e 1145 px, e `VRow` usa `gap` sem margem negativa. Em 320, 839, 840 e 1145 px não há rolagem horizontal.
- O slot de `VSelect` recebe `item` bruto e `internalItem`, e o de `VForm` entrega `isValid` desembrulhado.
- O menu aberto dentro de um diálogo fica acima dele e funciona. O teclado alcança os campos.

Os testes Vitest também confirmam os limites de `display`, e que uma resposta antiga não repovoa a tela depois de `limpar()`, com Router, Pinia e Axios na mesma instância. Capturas: [claro](evidencias/captura-light.png) e [escuro](evidencias/captura-dark.png).

## Achados

1. **Contraste no tema claro.** Na [primeira rodada](evidencias/playwright-inicial.txt), 2 de 12 testes reprovaram: o axe apontou `color-contrast` nos labels, com `medium-emphasis-opacity` padrão de 0,60. O tema escuro passou, com 0,70. A correção usa 0,75 no tema claro, mesmo valor adotado no laboratório Vuetify 3, sem suprimir regras. Como o padrão agora é `system`, os dois temas viram superfície real, e a especificação passou a registrar isso.
2. **Instrumentação do Vitest.** Dois testes falharam antes de qualquer conclusão sobre o Vuetify: um esperava objeto em `isValid`, que começa em `null`, e o outro não aguardava a rota lazy. Os testes foram corrigidos para conferir que o valor não é ref e para aguardar a primeira requisição.
3. **Node.** O Vite 8 pede Node ^20.19 ou >=22.12. O laboratório fixa Node 24 em `engines`, mas o executor do Playwright usou Node 26, da imagem oficial; o build testado foi o gerado em Node 24.

## Reprodução

Requer Docker. Não usa `.env`, serviço externo nem credenciais. A API é simulada com `page.route` no navegador. Na pasta deste relatório:

```powershell
docker run --rm -v "${PWD}:/lab" -w /lab/app node:24 sh -c "npm ci && npm run lint && npm test && npm run build"
docker run --rm -v "${PWD}:/lab" -w /lab/app mcr.microsoft.com/playwright:v1.64.1-noble sh -c "(npx vite preview --host 127.0.0.1 --port 15174 --strictPort &) ; sleep 4; npx playwright test"
```

O segundo comando regrava capturas e `playwright.json` em `evidencias/`.

## Limites

Comprova um projeto mínimo em Chromium headless, com API simulada, portanto sem integração com Laravel 13. Não cobre Firefox, WebKit, dispositivos físicos, leitor de tela, reflow com zoom, dev server do Vite (o achado de `useStack` não foi reproduzido; a configuração preventiva está em `vite.config.js`), SASS, `vuetify-codemods`, nem migração de um projeto Vuetify 3. Axe e a checagem parcial de teclado não comprovam acessibilidade integral. Não é avaliação comportamental da LLM nem certificação de produção. Os laboratórios de 29/10/2026 seguem em Vuetify 3 como registro histórico.
