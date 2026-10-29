# Validação integrada frontend — 29/10/2026

Aplicação Vue 3.5.44/Vuetify 3.13.7, Pinia 3.0.4, Router 4.6.4, Axios 1.21.0 e Vite 7.3.7, em JavaScript. Dependências reais e lockfile; nenhum pacote do ERP foi reutilizado. ESLint aprovado, 15 testes Vitest aprovados, 2 testes de caracterização do helper legado aprovados e build aprovado.

**Correções comprovadas:** imports de todos os componentes Vuetify geravam 711,72 kB de JS principal; imports seletivos reduziram para aproximadamente 327 kB após as correções de acessibilidade. Axe encontrou contraste 4,29:1 em labels/hints, 2,77:1 no alerta de sucesso e progressbar sem nome no carregamento. O tema foi corrigido e quatro botões receberam loaders com nomes acessíveis. A inspeção visual também detectou erros de campos vazios logo após salvar; o reset foi sincronizado com a atualização reativa do formulário e ganhou teste de regressão. Nenhuma regra axe foi suprimida.

O contrato local de logout distingue 401 (sessão já encerrada nesse endpoint) de 419; a revisão e os testes unitários ajustaram a reconciliação antes do navegador. Essa decisão depende do contrato do servidor e não é regra geral para qualquer erro 401. Dados privados ficam em memória; apenas o indicador não sensível de encerramento pendente é persistido.

Fonte e reprodução da aplicação: [app/README.md](app/README.md). Evidências unitárias, build, lint e legado: [app/evidencias/RELATORIO.md](app/evidencias/RELATORIO.md). Suíte Chromium em `browser/`; evidências antes/depois em `browser/evidencias/`. Capturas finais: [móvel](browser/evidencias/captura-mobile.png) e [desktop](browser/evidencias/captura-desktop.png).

## Navegador real

Playwright 1.64.1, Chromium 156.0.8078.4 headless e axe-core 4.14, em Windows/Node 24. **Dez testes aprovados, sem retries**:

1. Rota protegida, credencial inválida e POST sem CSRF rejeitado com 419.
2. Cadastro com CNPJ alfanumérico, edição, formulário limpo sem erros residuais, alerta acessível, mudança de conta e tentativa de alteração cross-tenant negada.
3. Validação 422 do servidor mesmo quando o frontend é contornado.
4. Logout confirmado no servidor, 401 posterior e recarga sem acesso privado.
5. Falha de rede no logout, recarga bloqueada e reconciliação explícita.
6. Resposta antiga liberada após troca de conta na mesma instância Vue/Pinia, sem repovoar a lista.
7. Limitação de login persistente entre requisições HTTP reais.
8. Limpeza entre duas abas e reconciliação de sessão já revogada.
9. Teclado, viewport 390×844, ausência de overflow horizontal e axe durante/depois do carregamento.
10. CNPJ inválido rejeitado no frontend, sem envio HTTP, com mensagem de campo acessível.

As primeiras tentativas e correções de instrumentação são preservadas: timeout inicial de 5s insuficiente sob carga do host, navegação que cancelava logout antes da confirmação e asserções prematuras. A configuração final usa timeout por caso de 120s e expectativa de 45s; isso não é medição de desempenho nem SLA. O teste de corrida agora preserva o documento e aguarda a requisição retida por identidade, sem recarregar o store. [Revisão independente](REVISAO.md).

## Reprodução integrada

Clonar os dois repositórios em pastas distintas. Dependências: PHP 8.4 com SQLite, Composer, Node 24 e npm. Sem `.env`, serviço externo ou banco operacional. Dados, senha e chave do app são públicos e exclusivos do laboratório. Não reutilizar este app em produção.

No backend, seguir `evaluations/2026-10-29-integracao/app/README.md`: instalar dependências, descobrir pacotes, preparar o SQLite local e iniciar porta 18765. No frontend, seguir o README correspondente: `npm ci` e `npm run dev` na porta 15173. Manter os dois servidores abertos durante os testes.

Em um terceiro terminal, na pasta `browser` do repositório frontend:

```powershell
npm ci
npx playwright install chromium
$env:LAB_BACKEND_DIR = 'C:\projetos-mf\skills-mf\skill-backend-mf\evaluations\2026-10-29-integracao\app'
npx eslint .
npm test
```

Ajustar somente o caminho absoluto se os clones estiverem em outro local. No Linux/macOS, usar `export LAB_BACKEND_DIR=/caminho/do/backend/evaluations/2026-10-29-integracao/app`. Antes de cada caso, o teste chama `scripts/limpar-cache.php` nesse app para limpar apenas suas quotas/cache de arquivos; a guarda recusa caminho externo ou links. Não há endpoint de reset. O preparo inicial do banco é destrutivo exclusivamente para o SQLite descartável e deve ser feito com servidor parado. Os casos criam registros sintéticos; para estado inicial, parar servidor e repetir o preparo guardado. Encerrar os servidores com Ctrl+C após o ensaio.

## Método e limites

Um agente implementou cada laboratório usando a skill; a coordenação definiu o contrato mínimo, executou o navegador e revisou correções. Outro agente revisou fontes e testes. Houve contexto herdado e feedback entre rodadas: não é avaliação cega ou estatística da LLM. O fluxo consultivo anterior permanece documentado na avaliação de fixtures; aqui as escolhas de laboratório estavam explícitas, sem inventar aprovação de decisões de produto.

Esta entrega comprova uma aplicação integrada em SQLite e Chromium no ambiente descrito. Não certifica produção, PostgreSQL/MySQL, Firefox/WebKit, dispositivos físicos, acessibilidade integral, todos os estados de falha, PSPs, filas ou concorrência distribuída. Axe e algumas interações de teclado não substituem avaliação completa com tecnologias assistivas. Dependências de desenvolvimento incluem ESLint 9, cujo aviso de fim de suporte está registrado; a reprodução fixa versões no lockfile, sem alegação de stack certificada. O ERP não foi lido para copiar código nem alterado.

As versões das especificações e tags anteriores foram preservadas. Esta atualização em `main` acrescenta evidências, projetos reproduzíveis e orientações de validação baseadas nos achados.
