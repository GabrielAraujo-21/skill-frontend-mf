# Laboratório frontend completo

Projeto descartável para avaliar `skill-frontend-mf`, sem reutilizar ou alterar arquivos do ERP. Não é starter de produção.

## Decisões do ensaio

Pedido: criar e adequar uma fatia Vue/Vuetify integrada ao Laravel para validar login, cadastro e edição de clientes, CNPJ e segurança de sessão no navegador. A arquitetura e contrato do laboratório foram definidos pela coordenação da avaliação: SPA, JavaScript, Vue 3, Vuetify 3, Pinia, Router, Axios, autenticação Sanctum por cookie, SQLite no backend e dois usuários de tenants diferentes. Essas escolhas não são impostas pela skill a outros projetos. Não há loja, PWA, pagamento ou SDK externo.

CRIAÇÃO: não existia starter neste diretório. REUTILIZAR: componentes/defaults Vuetify, sem BaseButton ou CSS próprio. ESTENDER: helper `nomeCliente` e rota `/clientes` preservados no ensaio de legado. A dependência de API foi contratada antes da implementação, não inferida de um mock.

## Execução

Requisitos: Node 24 e npm. Backend Laravel de teste em `127.0.0.1:18765`.

```powershell
npm ci
npm run lint
npm test
npm run test:legacy
npm run build
npm run dev
```

Abrir `http://127.0.0.1:15173`. O Vite encaminha `/api` e `/sanctum` ao backend; cookies ficam na mesma origem. Credenciais exclusivamente sintéticas do laboratório: `a@example.test` ou `b@example.test`, senha `Teste123456!`. Nenhum `.env` é necessário no frontend. Nunca usar essas credenciais em aplicação operacional.

## Contratos e seletores

- `/login`: campos E-mail/Senha, botão Entrar.
- `/clientes`: campos Nome/CNPJ, botão Salvar cliente; editar por nome acessível `Editar <nome>`.
- Lista `data-testid="clientes"`; identidade `data-testid="identidade"`; alerta `data-testid="logout-pendente"`; botão Sair `data-testid="sair"`.
- O formulário novo está sempre visível, sem botão que abre modal.
- Endpoints: `/sanctum/csrf-cookie`, `/api/login`, `/api/me`, `/api/logout`, `/api/clientes` e `/api/clientes/{id}`. Erros 422 usam `errors` por campo.

## Limites

Os testes Vitest exercitam Pinia e a lógica Vue real, com adapter HTTP simulado nas unidades. Integração, cookies, CSRF, acessibilidade e navegador são executados separadamente pela suíte browser do laboratório. O flag persistente de logout não contém identidade/token; dados privados permanecem em memória. Falha remota é mostrada e a reconciliação é explícita. Não se promete revogação do cookie antes de confirmação do backend.

A cópia de módulo em `legacy/` preserva nome público e comportamento válido de `nomeCliente`. O caso null falhou antes (`evidencias/legado-falha.txt`) e os dois testes passaram após a correção (`evidencias/legado-correcao.txt`); a fonte inicial está em `evidencias/legado-antes.txt`. Essa caracterização não alterou `src/` durante os testes de navegador e não representa migração integral de um legado externo.

O uso de localStorage, múltiplas abas, foco, teclado e respostas tardias precisa de verificação navegador, não somente asserções unitárias. Nenhum resultado aqui certifica produção, todos os navegadores, acessibilidade integral ou ambientes de terceiros. O arquivo lock registra versões efetivas; este projeto não atualiza versões de nenhum legado externo.
