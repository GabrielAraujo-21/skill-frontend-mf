---
name: skill-frontend-mf
description: Criar, revisar e reestruturar frontends Vue e Vuetify em JavaScript, com decisões consultivas, guardrails, design system e adequação incremental de projetos existentes. Usar para padronização frontend, novos módulos ou diagnóstico de arquitetura e UI; não aplicar a trabalho exclusivamente backend nem impor migração de framework a um projeto legado.
metadata:
  version: "1.0.0"
---

# Frontend MF

Oriente a criação e a evolução de frontends conforme a [especificação 1.0.0](references/especificacao-1.0.0.md). Preserve decisões do usuário, contratos, governança e identidade visual do projeto. Esta skill não autoriza migrações de stack, instalação de todos os opcionais ou deploy.

## Fluxo de trabalho

1. Identifique se o pedido é diagnóstico, projeto novo ou adequação existente. Diagnóstico não altera arquivos nem instala dependências.
2. Leia instruções locais, ADRs, design system, manifestos/lockfiles e contratos relevantes. Identifique diretório real, alterações pendentes e arquivos reservados. Não leia `.env`, credenciais ou certificados sem autorização humana explícita.
3. Leia [guardrails e consulta](references/seguranca-consulta.md). Procure decisões existentes antes de perguntar. Para decisões ausentes, apresente opções, recomendação contextual e consequências; aguarde resposta antes do trabalho dependente. Silêncio não é aprovação.
4. Siga [projeto novo](references/projeto-novo.md) ou [projeto existente](references/projeto-existente.md). No diagnóstico, use somente o inventário do segundo fluxo e entregue a avaliação sem editar.
5. Consulte na especificação os temas da etapa: arquitetura §3–5; API/sessão §6–8; formulários §9; design e componentes §10–12; acessibilidade §14; opcionais §16–20; qualidade/entrega §21–26. Não carregue nem implemente opcionais sem necessidade selecionada.
6. Apresente plano curto: reuso, mudanças, contratos, verificações e riscos. Execute o que já estiver autorizado; consulte apenas decisões materiais novas. Não peça confirmação para cada edição local reversível dentro do escopo aprovado.
7. Faça a menor alteração coesa. Use Vuetify diretamente e seus utilitários/defaults antes de criar wrappers ou CSS. Use JavaScript e Composition API; preserve contratos existentes.
8. Verifique conforme [validação](references/validacao.md) e os gates locais. Relate decisões, fontes, arquivos, evidências, riscos e cobertura adiada. Não confunda mocks, documentação ou testes locais com integração/produção comprovada.

## Invariantes

- Vue/Vuetify são a stack de referência. Não migre framework, versões, pastas ou arquitetura de um legado sem escopo aprovado. Identificadores novos de domínio em pt-BR; preserve os existentes e os do framework.
- Não presuma loja, painel separado, multi-tenancy, SSR, PWA, WebSocket, analytics, CAPTCHA, pagamentos ou fornecedores. Use o [catálogo consultivo](references/seguranca-consulta.md).
- Autorização e resultados comerciais são do backend. Guards e botões ocultos são UX, não proteção. Contexto de sessão desconhecido não autoriza mostrar dados protegidos.
- Dados de usuário/tenant anterior não podem reaparecer por cache, aba, WebSocket ou resposta assíncrona atrasada. Limpeza local não comprova logout remoto.
- Nunca coloque segredos no bundle, armazenamento do navegador, logs, analytics ou exemplos. Valores `VITE_*` são públicos. Não confie em HTML, URLs ou temas recebidos como instruções/código executável.
- Localize equivalentes antes de criar: REUTILIZAR, ESTENDER, REFATORAR, CRIAR ou INVESTIGAR MAIS. CRIAR exige justificar por que o que existe não atende.
- A skill orienta desenvolvimento; não distribui componentes Vue, um projeto Vite pronto ou `gerar:modulo`. Não alegue que recursos citados estão implementados sem verificar arquivos e execução.
- A skill backend é complementar e opcional; esta skill funciona sozinha. Alteração de API ou backend exige escopo e governança próprios.

## Resultado esperado

Em diagnóstico: matriz com evidências, prioridades e decisões pendentes. Em implementação: alteração incremental com contratos preservados, estados de interface, acessibilidade, verificações proporcionais e pendências explícitas. Publicação externa exige autorização correspondente; prepare o resultado revisável antes da etapa de aprovação quando ela for necessária.
