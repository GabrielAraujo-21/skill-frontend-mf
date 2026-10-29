# Ensaio frontend completo — 29/10/2026

Skill lida em `C:/projetos-mf/skills-mf/skill-frontend-mf`: SKILL.md, segurança/consulta, projeto novo, projeto existente e seções API/sessão/formulários/design/acessibilidade/qualidade da especificação. Baseline publicado antes do ensaio: `3895961982a1372169d93e866cebee86df69c942`.

O agente recebeu contrato e escolhas explícitas do laboratório da coordenação; não inventou aprovação humana para decisões abertas. O ensaio é dirigido, com contexto herdado, e não é teste cego de seleção automática da skill. As fontes e unidades são uma aplicação Vue executável, não respostas estáticas de um runner.

## Observado

- Dependências reais instaladas, com `package-lock.json`; sem reutilizar node_modules de projeto operacional.
- Lint inicial: 99 avisos de formatação Vue, zero erros; corrigidos pelo ESLint, lint final limpo.
- Primeiros testes/build: `spawn EPERM` do esbuild no sandbox. Logs preservados; reexecução autorizada com processos fora desse bloqueio. Não classificado como falha de assert ou defeito da skill.
- Vitest: 15 testes passaram, em duas suítes. Pinia real, requisições HTTP simuladas nas unidades. CNPJ, preservação de contrato legado, logout falho, persistência do indicador de pendência, reconciliação 401 versus 419, resposta antiga e evento de outra aba.
- Legado em cópia de módulo: caso null falhou antes com TypeError; após correção, dois testes passaram preservando a apresentação do valor válido e o identificador público. Logs `legado-falha.txt`, `legado-correcao.txt` e `legado-resultado.json`. Não se alterou a aplicação enquanto o navegador a usava.
- Build inicial concluído com aviso de bundle grande por importação de todos os componentes Vuetify. `build-final.txt` preserva o resultado antes da otimização. Importação seletiva dos 15 componentes efetivamente usados e Ripple reduziu JS principal de 711,72 kB (gzip232,42) para326,46 kB (gzip114,66), e CSS de521,46 kB para346,79 kB. `build-imports.txt` registra o resultado sem o aviso de chunk. Lint e15 testes passaram novamente após a mudança. É tamanho de bundle medido, não Core Web Vitals ou performance de campo.
- `npm audit --omit=dev`: zero avisos conhecidos para dependências de runtime nesta execução (`audit-producao.json`); não comprova ausência de vulnerabilidades nem cobre dependências de desenvolvimento.
- Integração backend, cookie/CSRF e interação Vue/Vuetify no navegador são responsabilidade da suíte browser separada; não inferir esse resultado dos testes Vitest.

## Decisão de sessão

O backend confirmou que `/api/logout` requer autenticação e responde 401 se a sessão já não existe. A reconciliação trata esse caso como encerramento confirmado; 419 não é tratado assim. Este é contrato do laboratório, não regra genérica para qualquer 401 de qualquer API. Só um indicador não sensível é persistido; a identidade e a lista ficam em memória. Ao trocar geração, respostas antigas são descartadas. A limpeza local acontece antes da rede terminar.

## Correção após navegador

A segunda rodada do navegador encontrou problemas reais no app: os loaders internos de VBtn não tinham nome acessível e labels/hint dos campos apresentavam contraste4,29:1. A composição foi ajustada pelo slot `loader`, com VProgressCircular nomeado por operação, mantendo o loading visível e o nome do botão estável. O token `medium-emphasis-opacity` do tema claro foi alterado para0,75, sem CSS por tela nem alterações no teste axe para esconder o problema. Todos os quatro botões com loading receberam a composição. O resultado posterior do navegador deve ser consultado na suíte browser; lint/unidades/build não comprovam contraste por si.

Esse achado mostra que usar Vuetify e seus defaults não dispensa verificar os estados renderizados. Recomendação para a skill: exercitar loading real e medir contraste de labels/hints no tema escolhido, corrigindo composição/tokens quando necessário; não criar wrappers universais nem desativar regras de acessibilidade para passar a suíte.

Uma inspeção visual posterior identificou mensagens de campo obrigatório ao lado de “Cliente salvo.”. O teste no Chromium reproduziu `Informe o nome`/`Informe um CNPJ válido` após sucesso; a análise axe do mesmo estado detectou branco sobre o verde success padrão com contraste2,77:1. A limpeza passou a aguardar `nextTick` antes de resetar validação dos campos, e o tema recebeu success `#2E7D32`/on-success `#FFFFFF`. As regras dos campos e o tratamento de422 foram mantidos. A evidência antes da correção fica na suíte browser; logs locais posteriores têm sufixo `pos-save`. Este caso exige validar o ciclo completo do formulário (inválido → válido → sucesso → novo cadastro), não somente o toast ou status HTTP.

## Limites

Não é certificação integral de acessibilidade ou produção. A implementação de laboratório e seus testes podem revelar problemas específicos sem comprovar defeito nas instruções gerais da skill. O aviso npm sobre descontinuação de ESLint9 foi preservado como limitação da ferramenta de ensaio; não foi feita migração de ferramenta em repositório operacional.

Os registros de terminal contêm somente dados sintéticos e caminhos do laboratório. Não houve leitura de `.env`, publicação, cobrança, instalação em ERP ou acesso a banco operacional por este agente.
