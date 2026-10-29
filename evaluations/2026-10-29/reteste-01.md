# Reteste dirigido F01

Pedido literal: “Criar painel interno Vue para uma organização”.

Este reteste recebeu feedback do auditor sobre a pergunta redundante de tenancy na rodada anterior. Não é uma avaliação cega. Foi relida a referência `references/seguranca-consulta.md` após sua alteração, que explicita respeitar escolhas presentes no pedido sem exigir ADR.

## Resposta produzida

Vou estruturar o painel Vue para a organização indicada, com contexto único e uma aplicação. Para esse painel interno, recomendo SPA e composição com Vuetify. Antes de implementar as telas e a integração, faltam duas definições:

1. Quais tarefas e papéis entram na primeira entrega? Podemos começar pelo fluxo principal de uma equipe ou incluir desde o início todas as áreas. Recomendo o fluxo principal para validar a navegação e as permissões com uma entrega menor; a segunda opção exige mapear mais dependências.
2. Já existe backend e contrato de autenticação? Se existir, recomendo reutilizar seu contrato. Se ainda não existir, podemos definir o contrato primeiro ou produzir uma prévia local com mocks identificados; recomendo definir o contrato antes da integração para evitar rotas e sessões presumidas. A prévia permite validar interface, mas não comprova autenticação ou autorização reais.

Não há arquivos existentes além do briefing para reutilizar. O próximo trabalho independente é levantar a estrutura das telas a partir dos fluxos informados. A criação dependente dessas definições permanece pendente; nenhuma instalação foi executada.

## Evidência e limite

Fixture novo em `reteste-01/projeto/briefing.md`; a ação observada foi ler o briefing e elaborar a resposta acima. O JSON registra hashes antes/depois, comando efetivo e hash da referência corrigida. Não houve teste de Vue, instalação ou implementação de painel. O comportamento consultivo será classificado pelo revisor, não por busca de palavras nesta resposta.

As evidências históricas não foram alteradas. Para publicação compacta: este Markdown e JSON, `executar.py`, `RELATORIO.md`, `rodada-2/resultados.json`, os quinze `rodada-2/cenarios/NN/evidencia.json` (incluem conteúdo inicial/resposta/saídas), os quinze diffs e os testes/módulos JS dos cenários 03, 05, 06, 07, 08, 09 e 15. O runner regenera fixtures completos. Para documentar a falha de infraestrutura inicial basta preservar `rodada-1-resultados.json` e uma evidência inicial com `spawn EPERM`, identificando-a como representativa; não é necessário duplicar todos os fixtures intermediários.
