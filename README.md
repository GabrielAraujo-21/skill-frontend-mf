# Frontend MF — skill 1.0.0

Skill para criar e reestruturar frontends Vue/Vuetify em JavaScript, com arquitetura modular, guardrails de segurança e decisões consultivas com o desenvolvedor.

## O que ela faz

- Orienta projetos novos, diagnóstico sem alterações e adequação incremental de legados.
- Reutiliza contratos, componentes e design system existentes antes de criar alternativas.
- Apresenta opções e recomendações quando faltam decisões de arquitetura/UI.
- Padroniza API, estado, sessão, formulários, acessibilidade, responsividade e qualidade.
- Trata multi-tenancy, SEO/SSR, PWA, tempo real, analytics e pagamentos como escolhas contextuais.

Referência: Vue 3, Vuetify 3, JavaScript, Composition API, Vite, Pinia, Vue Router e Axios. Versões exatas são conferidas em cada projeto; a skill não atualiza dependências automaticamente. É complementar à [Backend MF](https://github.com/GabrielAraujo-21/skill-backend-mf), mas não depende de sua instalação.

## Conteúdo

- [Instruções da skill](SKILL.md)
- [Especificação frontend 1.0.0](references/especificacao-1.0.0.md)
- [Guardrails e fluxo consultivo](references/seguranca-consulta.md)
- [Projetos novos](references/projeto-novo.md)
- [Projetos existentes e diagnóstico](references/projeto-existente.md)
- [Validação e cenários comportamentais](references/validacao.md)

## Pré-requisitos

Codex com suporte a skills locais; Git para clone/atualização; Python 3.9+ somente para o verificador opcional. Node, dependências Vue e serviços são requisitos do projeto trabalhado, não da instalação da skill.

O projeto da skill fica em `C:\projetos-mf\skills-mf\skill-frontend-mf`. Essa pasta de desenvolvimento não instala automaticamente a skill nos outros projetos. O pacote contém instruções e verificadores, não componentes Vue prontos, starter Vite, gerador de módulos ou infraestrutura.

## Instalação

Escolha um método para evitar cópias duplicadas. Os comandos abaixo são instruções, não executados automaticamente ao ler o README.

O Codex documenta `~/.agents/skills` para instalação pessoal e `.agents/skills` no projeto para escopo do repositório. Confira caminhos personalizados reconhecidos pelo seu ambiente. [Documentação oficial](https://learn.chatgpt.com/docs/build-skills).

### Windows — PowerShell, instalação pessoal

Recomendada para usar em vários projetos sem alterar o ERP. A instalação acompanha `main`.

```powershell
$diretorioSkills = Join-Path $env:USERPROFILE '.agents\skills'
$destinoSkill = Join-Path $diretorioSkills 'skill-frontend-mf'
if (Test-Path -LiteralPath $destinoSkill) {
    throw 'A pasta já existe. Confira seu conteúdo e a seção de atualização.'
}
New-Item -ItemType Directory -Path $diretorioSkills -Force | Out-Null
git clone https://github.com/GabrielAraujo-21/skill-frontend-mf.git $destinoSkill
if ($LASTEXITCODE -ne 0) { throw 'Falha ao clonar a skill.' }
Test-Path -LiteralPath (Join-Path $destinoSkill 'SKILL.md')
```

O último comando deve retornar `True`. Não é necessário executar como administrador para instalar em sua pasta pessoal.

### Linux/macOS — Bash, instalação pessoal

```bash
destino_skill="$HOME/.agents/skills/skill-frontend-mf"
if [ -e "$destino_skill" ]; then
  printf '%s\n' 'A pasta já existe; confira a seção de atualização.'
else
  mkdir -p "$HOME/.agents/skills" &&
    git clone https://github.com/GabrielAraujo-21/skill-frontend-mf.git "$destino_skill"
fi
```

### Instalação somente em um projeto

Crie `.agents/skills/skill-frontend-mf/` na raiz do projeto escolhido. Copie `SKILL.md` e as pastas completas `agents/`, `references/`, `scripts/` e `tests/`. Não copie `.git`, não crie repositório aninhado e não copie apenas SKILL.md. Revise/versione a cópia se a equipe deve compartilhá-la. Ela não acompanha atualizações automaticamente.

Esse método altera o projeto escolhido. Para preservar o ERP sem mudanças, prefira instalação pessoal.

### Confirmar instalação

Abra o projeto desejado no Codex e envie no chat:

```text
Use $skill-frontend-mf apenas para diagnóstico. Confirme que encontrou a skill,
identifique o frontend e as decisões já registradas. Não altere arquivos nem
instale dependências. Liste lacunas e recomendações para a próxima etapa.
```

Mudanças em skills são detectadas automaticamente; se ela não aparecer, reinicie o Codex. Invocação explícita é pelo nome `$skill-frontend-mf`; descoberta automática também está habilitada. [Funcionamento documentado](https://learn.chatgpt.com/docs/build-skills).

## Exemplos de uso

Cole os exemplos no chat, não no terminal. Abra o repositório correto e delimite o trabalho.

### Projeto novo

```text
Use $skill-frontend-mf para criar um painel Vue/Vuetify em JavaScript.
O backend é Laravel e os contratos serão fornecidos. Antes de implementar,
apresente opções e recomendações para arquitetura, design system, sessão,
multi-tenancy e requisitos de acessibilidade. Aguarde minhas escolhas nas
partes dependentes. Não configure pagamentos nem faça deploy.
```

### Diagnóstico de legado

```text
Use $skill-frontend-mf para revisar este frontend sem alterar arquivos.
Inventarie rotas, componentes, estado, API, estilos, acessibilidade e testes.
Classifique requisitos como atendidos, parciais, ausentes, não aplicáveis ou
conflitantes, com evidências e ordem recomendada de adequação.
```

### Reestruturação incremental

```text
Use $skill-frontend-mf para adequar somente o módulo de clientes.
Preserve rotas, payloads, permissões, props, eventos e identidade visual.
Procure componentes existentes antes de criar. Apresente as decisões faltantes
com recomendações e execute o plano autorizado após resolvê-las.
Não atualize versões nem altere o backend ou execute deploy.
```

### Revisão de UI e componentes

```text
Use $skill-frontend-mf para melhorar o formulário de cadastro deste módulo.
Priorize componentes e utilitários Vuetify, estados de erro/envio, teclado,
foco e responsividade. Reutilize o design system e preserve a API pública.
```

### Retomar etapa aprovada

```text
Use $skill-frontend-mf para executar a etapa aprovada no plano do projeto.
Reutilize escolhas registradas e consulte-me somente sobre decisões materiais
novas. Ao concluir, informe alterações, verificações, riscos e pendências.
```

## Fluxo consultivo esperado

O agente identifica o modo, lê governança/código, procura reuso, apresenta decisões ausentes e recomendações, aguarda escolhas necessárias e executa incrementos autorizados. Não repete perguntas respondidas nem solicita confirmação para cada arquivo. Um pedido pontual não dispara questionário de todos os módulos opcionais.

O backend continua autorizando e calculando resultados comerciais. A skill não habilita acesso por esconder botões e não trata limpeza local como logout remoto confirmado. Guardrails instrucionais complementam, não substituem, controles técnicos e revisão humana.

## Atualizar a instalação

Para clone pessoal no Windows, execute na mesma sessão PowerShell:

```powershell
$destinoSkill = Join-Path $env:USERPROFILE '.agents\skills\skill-frontend-mf'
$alteracoes = git -C $destinoSkill status --porcelain
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível consultar a instalação.' }
if ($alteracoes) { throw 'Há alterações locais. Preserve-as antes de atualizar.' }
$branchAtual = git -C $destinoSkill branch --show-current
if ($LASTEXITCODE -ne 0 -or $branchAtual -ne 'main') {
    throw 'Este procedimento exige main; confira se a instalação está fixada em uma tag.'
}
git -C $destinoSkill pull --ff-only origin main
if ($LASTEXITCODE -ne 0) { throw 'Atualização interrompida; confira a mensagem do Git.' }
```

Linux/macOS: confira `git -C "$HOME/.agents/skills/skill-frontend-mf" status --short`; com a pasta limpa e branch `main`, execute `git -C "$HOME/.agents/skills/skill-frontend-mf" pull --ff-only origin main`. Não force reset se houver divergência.

Cópia por projeto: atualize a origem, compare e incorpore o diff revisado, preservando personalizações. Atualizar a pasta de desenvolvimento não atualiza outras cópias instaladas.

Para fixar o lançamento original, em clone limpo execute `git checkout --detach v1.0.0`. A tag não acompanha `main`; esse clone não recebe atualizações pelo procedimento acima enquanto estiver destacado. Tags publicadas não são movidas para incluir correções posteriores.

## Verificar o pacote

Na raiz do clone:

```text
python scripts/validar_skill.py
python -B -m unittest discover -s tests -v
```

O primeiro deve retornar `Validação estrutural: OK`. Os testes verificam o próprio validador. Não instalam dependências nem usam rede; usam diretórios temporários. A validação não certifica a qualidade comportamental da skill nem um frontend. Cenários comportamentais estão em [validação](references/validacao.md) e sua documentação não significa execução.

## Solução de problemas

| Sintoma | Conferência |
|---|---|
| Skill não aparece | Caminho reconhecido, SKILL.md direto na pasta, referências completas; reinicie o Codex se necessário. |
| Nome duplicado | Verifique cópias pessoal e por projeto; mantenha o escopo desejado. |
| Mudança local não aparece | Confira a pasta efetivamente instalada; pode ser outro clone/cópia. |
| Python ausente | Instale 3.9+ para validar; a leitura da skill não depende de Python. |
| Conflito com ADR/design system | Resolver a decisão afetada, sem sobrescrever governança local. |
| Agente pergunta antes de implementar | Esperado quando falta escolha necessária; não deve repetir escolhas registradas. |
| Não encontra gerar:modulo | O gerador não é fornecido por esta skill; precisa existir ou ser implementado com autorização. |

## Limites da entrega

A especificação é independente da versão 1.109.0 do documento de e-commerce que a originou. Aprovações jurídicas, marca, contratos e histórico daquele produto não são universais. Este pacote não altera o ERP, não instala automaticamente a skill no Codex, não configura serviços e não publica aplicações. Mutações externas exigem autorização específica do escopo.

## Avaliação executada em 29/10/2026

Consulte o [relatório, evidências e reprodução](evaluations/2026-10-29/README.md). Ele separa respostas consultivas de testes PHP/Node e documenta correções e limites; não certifica uma aplicação completa nem substitui os testes dos projetos consumidores.

## Validação integrada Laravel e Vue/Vuetify

[Projetos completos, dez testes Chromium, correções e reprodução](evaluations/2026-10-29-integracao/README.md). A avaliação inclui autenticação real, SQLite, duas abas, falhas de rede e acessibilidade automatizada; os limites estão no relatório.
