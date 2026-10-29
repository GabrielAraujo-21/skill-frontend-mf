# Projeto novo

1. Identificar diretório e escopo; conferir que não há aplicação existente a preservar. `frontend/` é sugestão, não imposição.
2. Resolver decisões necessárias: superfície, renderização, stack/versões, design system, contrato da API, identidade e contexto organizacional. Não gerar persistência/caches dependentes de tenancy indefinida.
3. Registrar núcleo e opcionais escolhidos. Vue 3, Vuetify 3, JavaScript, Composition API, Vite, Pinia, Vue Router e Axios são referência; conferir compatibilidade real antes de instalar. SSR pode exigir composição/ferramentas adicionais e decisão própria; não escolher Nuxt implicitamente.
4. Localizar starter/componentes existentes e verificar versão, contratos e exemplos. Se ausentes, indicar o que será implementado, sem inventar biblioteca pronta.
5. Propor plano em etapas com reuso, contratos, verificações e riscos. Respeitar aprovação já dada; aguardar escolhas faltantes que condicionem implementação.
6. Construir uma fatia funcional: layout, rota, formulário/listagem, service, autorização de UX, estados e Resource/contrato real ou mock explicitamente identificado. Não gerar módulos vazios como entrega funcional.
7. Implementar primeiro o ciclo de sessão/contexto e a infraestrutura mínima de API. Backend não disponível: declarar limites e mocks; não inventar comportamento como se contratado.
8. Configurar tokens e defaults Vuetify. Criar componentes próprios só quando houver necessidade não atendida por composição. Validar teclado, foco e responsividade da fatia antes de multiplicar telas.
9. Adicionar módulos opcionais selecionados por etapa. Registrar dependências, comportamento de falha, privacidade e critérios de aceite.
10. Executar verificações proporcionais, registrar evidências e preparar documentação de operação. Não publicar, cobrar ou migrar serviços sem autorização.

Aceite: fluxo autorizado utilizável, estados visíveis, proteção contra mistura de sessão/contexto, contratos documentados, verificações com resultados e pendências explícitas. Prototipação, mocks e uma spec não comprovam integração real.
