# Spec de Convenções de Frontend MF

**Versão:** 1.0.0

**Data:** 2026-10-29

**Status:** Referência consolidada; aplicação condicionada às decisões e à governança de cada projeto.

**Escopo:** novos frontends, diagnóstico e reestruturação incremental de aplicações existentes. Fonte de extração: Spec de Convenções de Frontend do e-commerce, versão 1.109.0, fornecida pelo usuário. A numeração é independente; marcas, pareceres jurídicos, endpoints e aprovações daquele produto não são transferidos.

DEVE/NÃO DEVE: requisito no perfil aplicável. DEVERIA: recomendação com desvio justificado. PODE: alternativa. Opcionais só se aplicam quando escolhidos. Instruções do usuário e governança local prevalecem; não revogar ADRs implicitamente. Recursos descritos não são prova de implementação.

## 1. Stack de referência e compatibilidade

Vue 3, Composition API com `<script setup>`, JavaScript em `.js`/`.vue`, Vuetify 3, Pinia, Vue Router, Axios e Vite. Não criar scripts TypeScript. Identificadores novos de domínio em pt-BR sem acentos, preservando contratos e símbolos do framework. JSDoc para contratos e funções relevantes, sem documentação redundante de cada linha.

A fonte cita Vue 3.5.43, Vuetify 3.10.3, Pinia 4.0.3 e Vue Router 5.3.1. Esses números são histórico da fonte, não instrução de instalação: conferir versões disponíveis/instaladas, compatibilidade, Node, package manager, manifests e lockfiles antes de propor versões. Não atualizar projeto existente automaticamente.

Selecionar versão Node e gerenciador compatíveis, versionar lockfile e evitar misturar gerenciadores. Pacote novo exige necessidade, reuso avaliado, compatibilidade, custo no bundle e aprovação aplicável. Não introduzir plugin apenas para repetir recurso nativo.

## 2. Perfis e módulos opcionais

Núcleo: arquitetura, contratos de API, estado, sessão quando necessária, navegação, formulários, tokens, responsividade, acessibilidade, segurança e qualidade.

Perfis: aplicação administrativa, portal, site público ou e-commerce. Opcionais: múltiplos aplicativos/builds, multi-tenancy refletida na UI, SSR/SSG/híbrido, idiomas adicionais, tempo real, PWA/offline, push, CMS/texto rico, analytics, CAPTCHA e pagamentos. Escolher por requisito, não importar todos do e-commerce.

Marca Akenza, programas de associados, comissões/Zs, MEI, regras por país, Mercado Pago/Efí, temas metalizados e integrações ERP são domínio da origem. Podem inspirar exemplos, não integram o núcleo obrigatório.

## 3. Estrutura e fronteiras

Preservar estrutura existente adequada. Em novo projeto, referência proporcional:

```text
src/
  app/                 # montagem, router, layouts e plugins
  modules/<dominio>/   # views, components, composables, services; stores se necessárias
  shared/              # api, auth, utilitários e comportamentos transversais
  design-system/       # tokens, tema, defaults e composições reutilizáveis
  assets/
tests/                 # integração/E2E/visual quando aplicável
```

Alternativa `apps/<superficie>` somente quando houver aplicações independentes. Não criar pastas vazias ou stores para cumprir árvore. Traduções, schemas e testes próximos ao módulo quando necessários.

Módulo não importa detalhes internos de outro; expõe API pública explícita (por exemplo index.js). Evitar ciclos e dependência de shared em módulos. Não mover componente de domínio para shared apenas porque duas telas o utilizam; a propriedade do domínio continua relevante. App monta infraestrutura e rotas, não calcula regra comercial.

## 4. Nomenclatura e contratos

View: `ListaPedidosView.vue`; componente: nome composto PascalCase; composable: `useNome.js`; store: `dominio.store.js`; service: `dominio.service.js`; rotas nomeadas por domínio e ação. Kebab-case em paths é sugestão para novos contratos; preservar os existentes. Identificador público vem da API, sem substituir IDs por UUID unilateralmente.

Prefixo Base é opcional, não motivo para renomear biblioteca existente. Props/events/slots têm significado e tipos documentados em JavaScript, com validação em runtime quando útil. Declarar emits, evitar mutação de props e manter fluxo previsível. `v-model`, attrs e slots devem ser encaminhados deliberadamente, sem perder acessibilidade. Eventos do framework preservam nomenclatura.

## 5. Camadas e responsabilidades

View compõe tela e parâmetros; componente de apresentação recebe props/emite eventos; componente de domínio pode coordenar comportamento do seu domínio via composable. Services falam com API e adaptam contratos, sem UI. Composables encapsulam interação e estado; Pinia é usado para estado compartilhado/cache, não passagem obrigatória de toda requisição.

Fluxo permitido: View -> composable -> service -> API; store participa quando necessário. Não exigir View -> composable -> store -> service em todo caso. Estado local fica local; dados derivados usam computed, sem cópias redundantes.

Backend decide autorização, integridade, valores e resultados comerciais. Front pode validar formato, apresentar prévia, selecionar, filtrar e organizar UI; prévia não é confirmação de preço/frete/imposto. Não duplicar regras financeiras autoritativas. DOM necessário a foco, metadados ou observadores é permitido com dono e limpeza, sem proibição absoluta em composables.

## 6. API, erros e concorrência

Cliente Axios por contexto de API confiável; não impor cliente único para terceiros com credenciais distintas. Base URL e envelope vêm do contrato real. Headers de idioma/correlação com formato limitado. Não enviar cookies, Authorization ou headers internos a host arbitrário.

Sanctum SPA, quando escolhido: conferir topologia stateful, cookies, CSRF e CORS. `/sanctum/csrf-cookie` pode estar fora do prefixo `/api/v1`; resolver URL/cliente adequado. Não presumir envio automático de XSRF em toda topologia. Um fluxo de renovação em andamento para chamadas concorrentes, no máximo uma repetição após 419 conforme contrato e sem loop. Autenticação social/2FA são capacidades contratadas, não defaults de toda aplicação.

Erro normalizado com status, código estável, mensagem segura, campos e request_id. 401 invalida sessão no contexto certo; 403 pode significar permissão ou reautenticação por código; 409 tem ações por código, não sempre recarregar; 422 mapeia campos/arrays e erro geral; 429 respeita Retry-After; rede/5xx informa falha sem trace. Downloads Blob precisam reconhecer erros JSON sem tratar arquivo normal como erro.

Retentativa automática somente para operação segura ou contrato de idempotência confirmado. Header sozinho não comprova suporte. Reutilizar chave e payload da mesma operação; limites/backoff/jitter e estratégia para resultado desconhecido. Pagamento não confirmado não deve virar sucesso nem nova cobrança cega.

AbortController em buscas e tarefas vinculadas à tela; debounce ajustável. Cancelamento do navegador não desfaz escrita no servidor. Validar geração/contexto da resposta para descartar resultados antigos após mudança de filtro, rota, sessão ou tenant, mesmo quando cancelamento não foi suficiente. Operações duráveis têm acompanhamento explícito, não cancelamento cego ao desmontar.

## 7. Estado, cache e persistência

Pinia setup stores quando fizer sentido; nenhuma regra de uma store obrigatória por módulo. Setup stores precisam de reset próprio ou plugin validado; não presumir `$reset` automático. Reset deve cobrir estado sensível, referências, erros e caches pertinentes, sem apagar preferências não relacionadas.

Cache tem chave, TTL, capacidade/limite e invalidação definidos. Chaves consideram usuário, tenant, permissões/geração, idioma, moeda e parâmetros quando influírem. Não usar dados de um contexto em outro. Respostas tardias são invalidadas; listeners, timers, observers e canais têm cleanup, inclusive KeepAlive/ativação quando aplicável.

Persistência por allowlist: preferências não sensíveis, estado de visitante aprovado ou rascunho seguro com prazo. Nunca tokens de sessão, credenciais, dados de cartão ou documentos pessoais por conveniência. Armazenamento local não equivale a anonimato. Definir schema/versão, expiração, limites e tratamento de JSON inválido/quota/acesso bloqueado. Não chamar localStorage.clear indiscriminadamente. Sincronização entre abas sem distribuir segredos; BroadcastChannel/storage conforme suporte e necessidade.

## 8. Sessão, tenant, permissões e navegação

Sessão distingue carregando, autenticada, anônima, desconhecida/indisponível e reautenticação pendente. Falha de rede ao verificar identidade não libera UI protegida nem restaura dados do usuário anterior. Guards são UX; backend valida toda ação. Permissões/flags não substituem autorização; capacidade pública não contém segredo.

Logout: limpar estado local em finally é apropriado, mas não comprova revogação do cookie HttpOnly no servidor. Informar falha de encerramento remoto e impedir restauração silenciosa local enquanto o fluxo de encerramento estiver pendente; reconciliar conforme contrato, inclusive ao recarregar. Não prometer que a próxima visita exigirá login sem revogação efetiva.

Troca de tenant: validar vínculo no backend, bloquear transição concorrente, invalidar caches/respostas/canais e recarregar capacidades. Exibir contexto de organização/suporte assistido quando necessário; nenhum bypass administrativo.

Rotas lazy com meta de título/layout/requisitos conforme projeto; slugs e parâmetros existentes preservados. Redirecionamento de retorno deve validar mesma origem/caminho interno efetivo, rejeitando `//host`, protocolos e variantes codificadas perigosas, não apenas startsWith('/'). Definir 403/404/manutenção. Restaurar scroll ao voltar; foco no conteúdo em navegação nova, sem deslocá-lo em cada filtro/hash/paginação.

## 9. Formulários e valores

Vuetify por composição; labels visíveis, instrução necessária, erro associado, resumo de erros quando útil. Validação cliente melhora UX; servidor é autoridade. Erros de campo desconhecido aparecem no resumo, não desaparecem. Distinguir ausência, vazio e null. Separar erro transitório, erro persistente e validação junto ao campo.

Definir dirty state, envio, sucesso, falha, conflito e cancelamento. Prevenir duplo envio e preservar entrada segura quando falhar. Avisar antes de abandonar alterações relevantes sem bloquear toda navegação. Autosave apenas com requisito, status e conflito definidos. Formulário por schema só para repetição real, com extensão acessível e sem linguagem de programação improvisada.

Moeda e escala vêm do contrato. Exibir valores exatos sem intermediários float indevidos; respeitar limites seguros do JSON/JavaScript e usar strings quando necessário. Não assumir centavos para toda moeda nem fazer câmbio implícito. `Intl` com compatibilidade verificada; arredondamento comercial fica no backend. Datas civis Y-m-d não são instantes UTC; fusos por usuário/tenant/regra, não inferidos universalmente do país.

Documentos por jurisdição; CNPJ numérico e alfanumérico preservam letras/zeros e validam regras oficiais. Telefones têm país e formato contratado; não remover símbolos/letras de todo documento indiscriminadamente. Máscara não é validador.

Senhas de usuário podem usar gerenciadores, colagem e revelação acessível conforme requisito. Campos de segredo de integração podem exigir comportamento diferente (substituir/manter sem revelar). Não aplicar `autocomplete=new-password` a todo tipo de credencial. Upload valida previamente para UX; servidor confere conteúdo/propriedade. Progresso e cancelamento têm semântica real; revogar object URLs ao terminar.

## 10. Componentes e biblioteca compartilhada

Usar Vuetify diretamente, defaults e utilitários antes de criar wrappers. Componente próprio exige responsabilidade reutilizável não atendida adequadamente por composição existente. Não criar BaseBotao/BaseCampo universal só para repetir props. Não exigir uma lista de componentes para todos os projetos.

Candidatos gerais: cabeçalho, estados de coleção, feedback, confirmação e composições de formulário/lista. Especializados: moeda, documento, upload, reautenticação e texto rico quando necessários. De domínio: carrinho, cartão salvo, comparação, comissões, decoração e integração de gateway permanecem fora do núcleo genérico.

Contrato documenta props/emits/slots, attrs, loading/disabled, foco, teclado, erros e exemplos. Componente compartilhado não busca API de domínio por conta própria; conectores de domínio podem fazê-lo via composable. Catálogo/showcase local com dados sintéticos ajuda revisão; não publicar telas de demonstração no produto sem necessidade. Testar comportamento e composição, não só snapshots.

## 11. Estados e mensagens

Toda tela com dados trata carregamento inicial, vazio, erro e conteúdo; quando pertinente, atualização em segundo plano, falha parcial, dados desatualizados e operação pendente. Não apagar conteúdo válido a cada revalidação. Erro cancelado não dispara toast. Mensagem de erro inclui ação possível e request_id quando útil, nunca SQL/trace.

Feedback global, validação de campo e estado persistente são categorias distintas. Evitar várias notificações para a mesma falha por interceptador e tela. Textos claros, botões com ação concreta, estados não só por cor. Loading e anúncios acessíveis sem ruído excessivo. Confirmação proporcional ao risco: não pedir confirmação para toda edição, nem prometer desfazer quando a API não suporta.

## 12. Design, temas e responsividade

Fonte única de tokens e mapeamento ao tema/defaults Vuetify. Identidade de marca é perfil do projeto. Sem literais de cor/raio/espaçamento espalhados; priorizar classes Vuetify. CSS próprio somente quando necessário, com escopo, tokens e justificativa. Não proibir CSS a ponto de impedir acessibilidade ou comportamento não coberto pela biblioteca.

Tema claro/escuro conforme requisito, preferência e escolha do usuário; tokens semânticos testados. Tema vindo da API/cache é dado não confiável: schema, allowlist de propriedades/valores, limites, fallback e versão; não aceitar CSS/script arbitrário. Bootstrap sem flash deve funcionar com CSP e armazenamento indisponível, sem assumir acesso síncrono à CDN.

Mobile-first; pontos de quebra Vuetify/useDisplay com comportamento por conteúdo. Evitar detecção por user agent. Tela a 320 CSS px e zoom verificados, sem rolagem horizontal global desnecessária. Tabelas podem virar lista/cartão ou manter região rolável acessível conforme tarefa, não conversão obrigatória. Evitar duplicar conteúdo acessível nas duas versões.

Imagens com dimensões/aspect ratio, srcset/sizes quando útil, lazy abaixo da dobra; não atrasar imagem principal crítica. Movimentos respeitam prefers-reduced-motion inclusive em mudança durante sessão. Decoração é opcional, sem obstruir controles, com pausa quando requerida, sem flashes perigosos e sem depender de sinais de hardware não disponíveis. Sinais ausentes não comprovam aparelho potente.

## 13. Internacionalização

vue-i18n quando selecionado; idiomas por projeto, não quatro obrigatórios. Chaves semânticas por módulo, mensagens comuns sem duplicação e pluralização adequada. Texto de interface traduzível; exceções explícitas para marca, códigos e conteúdo externo. Paridade de chaves não comprova qualidade da tradução.

Idioma, país, moeda e fuso são conceitos separados. Precedência de URL/preferência/tenant/navegador definida; Accept-Language compatível. Atualizar html lang e marcar conteúdo em idioma diferente. Fallback de conteúdo informado quando relevante. Rotas localizadas e troca de idioma preservam contexto somente quando a página existe. Testar expansão de texto, números e formatos; RTL quando incluído.

## 14. Acessibilidade

Alvo recomendado WCAG 2.2 AA; seguir requisito contratual e critérios documentados. Teclado, foco visível e não encoberto, ordem lógica, skip link, headings/landmarks, nomes acessíveis, contraste em todos os temas e estados. Modal tem foco contido e retorno; gaveta não modal não deve prender foco automaticamente. Esc e prevenção de perda de edição têm comportamento definido.

Redimensionamento de texto a 200% e reflow equivalente a 320 CSS px são verificações distintas; avaliar zoom de 400% no viewport de referência e exceções de conteúdo bidimensional. Alvos de 44 px são recomendação de usabilidade do padrão, não descrição universal do mínimo AA. Arrastar tem alternativa por controles/teclado; autenticação permite gerenciadores/colagem e não cria barreira cognitiva desnecessária.

Alt significativo para imagem informativa; decoração vazia/oculta. ARIA complementa HTML semântico, não substitui elemento correto. Não aninhar botão em link. aria-live para mudanças relevantes, sem anunciar cada atualização de cada card. Gráfico tem alternativa de dados. Virtualização preserva navegação e conteúdo acessível.

Axe detecta parte dos problemas; incluir avaliação manual de teclado, foco, zoom/reflow e leitor de tela em fluxos críticos. Não declarar conformidade por teste automatizado isolado.

## 15. Desempenho e compatibilidade

Definir navegadores/dispositivos e orçamento por superfície. Metas iniciais sugeridas: LCP <= 2,5s, INP <= 200ms e CLS <= 0,1 no percentil 75 de campo; ambiente de laboratório documentado fornece evidência complementar, não equivale a RUM. Definir orçamento de JS/CSS/imagens/fontes e medir build real.

Lazy routes/componentes pesados, imports seletivos, imagens responsivas e fontes com fallback/métricas adequadas. Não prefetch de dados sensíveis nem conteúdo oneroso sem critério. Virtualizar quando volume justificar, preservando a11y. Evitar watchers profundos indiscriminados, solicitações duplicadas e trabalho após desmontagem.

Feature detection e fallback em APIs opcionais. Testar rede lenta/falha parcial e armazenamento bloqueado. Não prometer suporte de push, service worker, Intl ou deviceMemory sem verificar matriz de navegadores. Orçamento do e-commerce original não define SLO de todo projeto.

## 16. Tempo real opcional

Echo/Reverb é uma alternativa compatível com Laravel, não obrigação. Definir canais, autorização, formato, versão e contexto. Payload mínimo notifica mudança; reconsulta API é default seguro. Aplicar dados diretamente só com contrato público completo, versionado e autorizado.

Ignorar eventos antigos/contexto incorreto, deduplicar e agrupar revalidação com atraso limitado para evitar avalanche. Reconexão com backoff, ressincronização e fallback quando necessário. Gerenciar assinatura compartilhada por referência; sair quando último consumidor sair e encerrar no logout. Tratar revogação de acesso durante conexão, não só no subscribe inicial. Não atualizar totais/facetas por aproximação não contratada.

## 17. Segurança de conteúdo e integrações

Nunca compilar template não confiável. v-html restrito a ponto controlado de texto rico sanitizado, com DOMPurify/configuração mantida e proteção no backend. Avaliações, mensagens e labels como texto por padrão. Validar URL/protocolo, links externos e destinos de navegação. JSON embutido no HTML precisa serialização segura contra fechamento de script; usar dados não torna injeção automaticamente segura.

VITE_* e tudo entregue ao browser são públicos. Não guardar segredos em código, storage, source maps ou estado persistido. CSP/headers coordenados com servidor; evitar eval e inline não autorizado. Sanitização, allowlist e CSP são complementares. Dependências auditadas; sem audit fix --force automático. SDKs de terceiros carregados somente no fluxo necessário, com allowlist e configuração pública validada.

Pagamentos: dados sensíveis somente nos mecanismos autorizados do provedor, sem stores/logs/replay; tokenização e elegibilidade PCI dependem de integração/avaliação próprias. CAPTCHA validado no backend, com falha e alternativa de recuperação acessíveis. OAuth conduzido conforme contrato seguro, sem inventar endpoints ou transportar tokens sensíveis por conveniência.

## 18. Privacidade e observabilidade

Inventário de dados, finalidade, destinos e retenção por projeto. Não transportar PII em query string, eventos, breadcrumbs ou screenshots de teste. IDs pseudônimos podem continuar sendo dados pessoais; armazenamento apenas local não implica anonimato. Aprovação jurídica do produto de origem não se estende a outro.

Analytics opcional, encapsulado, com catálogo de eventos/propriedades permitidas, minimização, consentimento/base aplicável e revogação. Primeira parte não elimina obrigações. Compras/reembolsos confirmados pelo servidor quando relacionados a resultado financeiro; não duplicar eventos por re-render. Limpeza de URL usa router/history preservando estado de navegação; não garante apagar logs do servidor já gerados.

Sentry/GlitchTip ou outro provedor é escolha. Remover dados antes de enviar, inclusive URL, query, formulário, headers e mensagens. Replay desligado até decisão explícita e proteção adequada. Configuração pública de DSN não autoriza destino arbitrário. Correlacionar versão, app, nome da rota e request_id; relatórios devem funcionar sem bloquear a UI quando o serviço falhar. Nenhum teto/plano gratuito presumido como permanente.

## 19. Conteúdo público e SEO

Escolher SPA, SSR, SSG ou híbrido por conteúdo, indexação, performance e operação. Metatags injetadas não equivalem à renderização do conteúdo principal. Não impor SSR a painel privado nem manter SPA por herança do e-commerce sem avaliar o objetivo.

Definir título, descrição, canonical, robots, Open Graph, alternates, JSON-LD e status HTTP coerentes. Uma fonte de conteúdo/metadados; remover metadados da rota anterior na navegação. Slugs, redirects, 404/410 e URLs locais conforme contrato. Sitemap e políticas de indexação têm responsável definido. noindex não é controle de acesso e não protege homologação por si só.

SSR/híbrido: estado por requisição, sem singleton com dados de usuário; hidratação consistente, acesso ao browser apenas no ciclo adequado, caches particionados e nenhum dado privado em HTML compartilhado. Testar HTML inicial e navegação do cliente. Publicação de conteúdo/CMS é módulo próprio, sem catálogo de blocos comerciais obrigatório.

## 20. PWA, offline e push opcionais

Decidir objetivo (instalação, cache estático, offline funcional, push) separadamente. Manifesto por necessidade, escopo/origem corretos; não incluir service worker automaticamente. Default conservador: cache de assets versionados e fallback offline, sem respostas autenticadas/API ou HTML pessoal. Offline de dados exige projeto específico de armazenamento, autorização, conflito e sincronização.

Atualização apresenta aviso e respeita edição/operação crítica. Evitar reload forçado/loop; gerenciar ativação, versões e retenção de assets para abas antigas. Publicar novos chunks antes de HTML que os referencia; plano de reversão inclui cache/service worker. Testar falha de dynamic import e recuperação sem perder trabalho.

Push pede permissão após gesto contextual, tem fallback por suporte e não repete solicitações indevidas. Inscrição é vinculada com segurança no servidor; logout/troca de titular exige desvinculação e reconciliação se falhar. Payload mínimo e URLs de mesma origem validadas. Não prometer remoção remota da inscrição quando rede falhou. Notificação visível em tela bloqueada tem risco de exposição.

## 21. Testes e evidências

Vitest/Vue Test Utils para comportamento de componentes/composables/stores/services; Playwright para fluxos, visual e axe; MSW para cenários controlados. Reutilizar suíte existente adequada. Testes com mocks não comprovam integração; manter testes de contrato e integração real controlada conforme risco. Não depender de rede externa nos testes determinísticos, sem proibir testes de integração próprios.

Cobrir estados, erros por código, cancelamento, concorrência, resposta tardia após logout/troca, revogação, foco, teclado e contratos pertinentes. Dados sintéticos, datas/aleatoriedade controladas e cenários de falha. Visual por breakpoints/temas relevantes, não somente screenshot desktop.

Cobertura é indicador, não garantia; 80% pode ser meta acordada, não bloqueio universal. Falhas anteriores documentadas, sem esconder novas. Diferenciar documentação, cenário de teste escrito, teste executado e validação operacional.

## 22. Qualidade e verificações

ESLint com regras Vue e regras de a11y/tokens/i18n adequadas; Prettier com configuração local. JSDoc nos contratos relevantes. Não proibir textos de marca ou dados de domínio por regra cega; exceções explícitas. Rodar lint/testes/build proporcionais a código alterado conforme gates; não rodar suíte por alteração apenas documental.

CI é decisão do projeto; a decisão sem CI do e-commerce não é default desta skill. Não transformar testes locais em gate de homologação nem certificar produção com mocks. Vulnerabilidades e varreduras conforme risco e autorização; varredura ativa não é operação automaticamente segura.

## 23. Build, ambientes e publicação

Build reprodutível com lockfile, runtime Node compatível e artefatos identificados. Separar config pública de runtime e build; não prometer mesma imagem se VITE_* de ambiente altera bundle. Publicar source maps somente ao destino autorizado. Assets com hash podem usar cache longo; HTML/manifest/service worker exigem política de atualização coerente.

Docker multi-stage/hosting/CDN são escolhas de operação, não obrigação de um frontend. Conferir base path, fallback SPA por aplicação e endpoints backend; não devolver HTML 200 para arquivo JS inexistente. Em SSR, processo e healthchecks próprios. Não copiar configurações de marca/domínio do e-commerce.

Deploy exige destino/revisão conhecidos, autorização, artefatos verificáveis, saúde e reversão. Manter assets usados por sessões existentes; rollback de imagem não reverte estado local/service worker automaticamente. Documentar comandos reais do projeto; não inventar serviço Docker ou rotina de publicação.

## 24. Geradores e automação

`gerar:modulo` é contrato opcional, não comando entregue por esta skill. Verificar se existe antes de executar. Se implementado com autorização: dry-run, validação de nome/path, recusa de overwrite, ações selecionadas, criação atômica ou recuperação em falha, execução repetível e sem efeitos externos. Parser não executa argumento como código.

Não gerar CRUD, store, quatro idiomas ou permissão fictícia para todo módulo. Registro de rotas/imports deve preservar código existente. Testes gerados são ponto de partida, não evidência de cobertura. MJML/e-mails são módulo de ferramentas opcional; não pressupor acesso de escrita ao backend.

## 25. Aceite e documentação

Nova tela: contrato de rota/API, estados, formulário seguro, permissões de UX, dados mínimos, responsividade, teclado/foco, temas/idiomas selecionados e verificações proporcionais.

Novo módulo: responsabilidade, API pública de imports, ausência de duplicação, estado/cache necessários, efeitos com cleanup e integração documentada. Projeto existente: baseline, contratos preservados, migração incremental, regressões e riscos registrados.

Toda rotina nova (geração, build, publicação, atualização de tema/ícones, migração de storage) precisa de roteiro proporcional com ator, pré-condições, comandos reais, recusas, conferência e reversão quando aplicável, seguindo índices documentais locais. Não duplicar regras na skill e no projeto; apontar fonte proprietária.

## 26. Origem, manutenção e limites

1.0.0 (2026-10-29): extração da spec e-commerce 1.109.0; núcleo independente, opcionais, correções de sessão/reset, documentos, acessibilidade/SEO, contratos e concorrência; guardrails e fluxos consultivos para criação e adequação. Nenhum status de implementação do e-commerce foi promovido a componente disponível neste pacote.

As bibliotecas próprias precisam de implementação, versão e evidências antes de reutilização. Esta spec não distribui Vue components, starter, adaptador de pagamento, gerador ou deploy. Manter este documento consistente com as referências da skill; mudanças de contrato incrementam versão e registram motivo. Mudanças só no README não exigem reescrever tags publicadas.

Referências técnicas (conferir versão efetiva ao implementar):

- Vue, segurança: https://vuejs.org/guide/best-practices/security.html
- Pinia, reset em setup stores: https://pinia.vuejs.org/core-concepts/state.html#resetting-the-state
- Laravel Sanctum: https://laravel.com/docs/12.x/sanctum
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Google, JavaScript e SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Receita Federal, CNPJ alfanumérico: https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico
- PCI SSC, elegibilidade SAQ A: https://www.pcisecuritystandards.org/faqs/1588/
