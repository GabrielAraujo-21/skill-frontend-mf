# Diagnóstico e adequação de projetos existentes

## Descoberta

Ler instruções/ADRs, design system, manifestos/lockfiles, entrypoints, router, stores, cliente HTTP, services, componentes, estilos, traduções, testes, mocks e pipeline conforme a tarefa. Conferir imports/consumers e histórico Git quando necessário. Revisão implantada somente quando pertinente e com acesso autorizado. Não ler `.env` nem segredos sem autorização.

Inventariar cada requisito como atendido, parcial, ausente, não aplicável ou conflitante; citar evidência, impacto e recomendação. Busca sem resultado não prova ausência. Identificar comportamento contratado, falha comprovada e hipótese separadamente.

Classificar REUTILIZAR, ESTENDER, REFATORAR, CRIAR ou INVESTIGAR MAIS. A criação exige justificar alternativas encontradas. Não criar abstração comum por semelhança apenas visual.

## Plano de adequação

- Preservar diretório, stack, versões, framework de testes e identidade visual aprovados. Migração de Options API, Vue antigo, outra biblioteca ou TypeScript existente é frente específica; novo código desta referência é JavaScript, mas não converter o legado indiscriminadamente.
- Preservar rotas, query strings contratadas, bookmarks, payloads, permissões, props, eventos e slots públicos. Planejar compatibilidade/versionamento quando inevitável.
- Registrar decisões faltantes com opções e recomendação; não repetir decisões vigentes. Aplicar por fluxo/módulo, não por reescrita geral.
- Criar testes de caracterização quando necessários para preservar comportamento antes da refatoração. Não consolidar uma falha de segurança como contrato imutável.
- Mapear tokens e componentes existentes antes de criar `Base*`, nova pasta shared ou novo tema. Alteração visual material pede referência/protótipo conforme governança.
- Identificar estado duplicado, imports circulares, caches sem contexto e efeitos sem limpeza antes de adicionar bibliotecas de estado ou dados.

## Execução incremental

Estabelecer baseline de verificações e falhas anteriores. Alterar uma fatia, migrar consumidores, testar estados/contratos e então expandir. Admitir coexistência temporária de padrões com prazo/critério quando necessário.

Ao modificar persistência local, definir versão, migração/expiração e comportamento para dados antigos; não apagar indiscriminadamente armazenamento de outros módulos. Ao corrigir sessão, testar respostas tardias, múltiplas abas, revogação e troca de tenant quando aplicável. Ao trocar assets, preservar os necessários a sessões abertas.

Backend fora do escopo: documentar contrato necessário e limitar dependentes; não editar ERP ou API de outro repositório implicitamente. Alterações de deploy/service worker exigem plano de atualização e reversão.

## Entrega

Relatar arquivos, contratos preservados, mudanças, evidências, riscos e cobertura adiada. Atualizar documentos apenas com mudanças comprovadas. No modo diagnóstico, entregar matriz e plano na resposta, sem editar arquivos, instalar pacotes ou executar ações mutantes.
