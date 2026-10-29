# Avaliação frontend — 29/10/2026

Baseline da skill: `9c9eaf0ebc110ce6ab24f46bd0e31c7bc2fb3d11`. Evidências históricas: [baseline.json](baseline.json). Código de reprodução: [executar.py](executar.py).

## Método e resultados

15 cenários registrados. Sete suítes Node totalizam 27 testes de helpers, mock, logout, resposta tardia e CNPJ; 21 comandos Node terminaram com sucesso. Consultas/recusas foram revisadas qualitativamente, sem asserções por palavras-chave. SFCs receberam somente inspeção estática.

A revisão identificou F01 reabrindo a escolha de tenancy apesar do pedido para uma organização. `references/seguranca-consulta.md` foi esclarecido e a resposta corrigida está em [reteste-01.json](reteste-01.json). O reteste recebeu feedback: não é avaliação cega. As respostas antigas no baseline e no runner permanecem históricas e não são recomendações atuais.

A primeira execução Node encontrou `spawn EPERM`, preservado no baseline. O runner usa `--test-isolation=none` para executar sem worker separado. O teste de mudança de usuário inicialmente mudava tenant também; o runner foi corrigido para isolar essas duas condições e reexecutado. Logout usa persistência sintética em memória; não comprova cookies, recarga real ou múltiplas abas.

Um agente por skill elaborou os cenários em lote, com contexto herdado e acesso aos critérios. Outro agente revisou artefatos e reproduziu os runners. Não houve isolamento de modelo por cenário, avaliação cega, amostragem estatística ou certificação de segurança. Os projetos são fixtures mínimos descartáveis com dados sintéticos. Não foram instaladas aplicações Laravel/Vue completas, nem executados banco operacional, navegador ou serviços externos. O ERP não foi alterado.

Os runners reproduzem arquivos e testes determinísticos, incluindo respostas estáticas registradas. Eles não invocam uma LLM e não reavaliam o comportamento de uma versão futura da skill. As implementações dentro deles são instrumentos de teste, não componentes de produção para copiar. Hashes demonstram alterações nos arquivos inventariados; não provam ausência universal de leituras ou ações externas. Não foi criado arquivo `.env`; a injeção de instruções foi avaliada como resposta consultiva, não como ensaio instrumentado de exfiltração.

## Reprodução

Ambiente utilizado: Python 3.12, Node 24. Sem dependências Python externas. Na pasta deste relatório:

```powershell
python executar.py --saida rodada-local
```

O nome deve ser simples e inédito. O runner cria uma pasta filha, não sobrescreve rodadas e retorna código não zero em falha. Revise os resultados gerados antes de concluir sucesso. Para repetir, escolha outro nome `rodada-*`; essas saídas não são versionadas.

Fonte dos vetores CNPJ: [manual oficial Receita Federal/Serpro](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf). Formato e dígito verificador não comprovam situação cadastral.

## Nova avaliação comportamental

Fornecer a um executor a skill, um pedido literal e os artefatos mínimos, sem resposta esperada. Registrar baseline completo, prompt, fontes lidas, resposta, comandos/saídas, diffs e limitações. Separar resultado consultivo, execução comprovada, falha e inconclusivo. Decisões faltantes permanecem perguntas, sem inventar aprovação humana. Usar diretório novo e dados sintéticos, sem acesso a serviços operacionais. Revisor confere efeitos e contratos, não apenas palavras na resposta. Preservar primeira rodada e retestar correções separadamente.

## Verificação antes da publicação

Reprodução final do runner publicado: [runtime-final.json](runtime-final.json), sem falhas inesperadas. Validador estrutural, quick_validate da skill-creator e Ruff (E4/E7/E9/F/I) passaram. Os seis testes unittest do validador frontend passaram. As versões das especificações e tags anteriores foram preservadas; esta entrega registra avaliação e ajustes incrementais.
