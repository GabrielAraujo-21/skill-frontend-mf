#!/usr/bin/env python3
"""Valida estrutura e referências locais; não executa projetos consumidores."""

import re
import sys
from pathlib import Path


def validar(raiz):
    """Retorna erros de estrutura do pacote, sem escrever ou acessar rede."""
    raiz = Path(raiz).resolve()
    erros = []
    obrigatorios = [
        "SKILL.md",
        "agents/openai.yaml",
        "references/especificacao-1.0.0.md",
        "references/seguranca-consulta.md",
        "references/projeto-novo.md",
        "references/projeto-existente.md",
        "references/validacao.md",
    ]
    for nome in obrigatorios:
        if not (raiz / nome).is_file():
            erros.append(f"Arquivo ausente: {nome}")
    entrada = raiz / "SKILL.md"
    if entrada.is_file():
        texto = entrada.read_text(encoding="utf-8")
        cabecalho = re.match(r"\A---\n(.*?)\n---\n", texto, re.DOTALL)
        if not cabecalho:
            erros.append("Frontmatter ausente ou inválido")
        else:
            if not re.search(r"^name: skill-frontend-mf$", cabecalho[1], re.MULTILINE):
                erros.append("Nome da skill divergente")
            if not re.search(r"^description: \S.+$", cabecalho[1], re.MULTILINE):
                erros.append("Descrição ausente")
            if 'version: "1.0.0"' not in cabecalho[1]:
                erros.append("Versão do pacote divergente")
    for arquivo in raiz.rglob("*.md"):
        if ".git" in arquivo.parts:
            continue
        for link in re.findall(
            r"\[[^\]]*\]\(([^)]+)\)", arquivo.read_text(encoding="utf-8")
        ):
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", link) or link.startswith("#"):
                continue
            caminho = (arquivo.parent / link.split("#", 1)[0]).resolve()
            if not caminho.is_relative_to(raiz) or not caminho.is_file():
                erros.append(
                    f"Referência local inválida em {arquivo.relative_to(raiz)}: {link}"
                )
    especificacao = raiz / "references/especificacao-1.0.0.md"
    if especificacao.is_file() and "**Versão:** 1.0.0" not in especificacao.read_text(
        encoding="utf-8"
    ):
        erros.append("Versão da especificação divergente")
    return erros


if __name__ == "__main__":
    raiz = (
        Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    )
    erros = validar(raiz)
    for erro in erros:
        print(f"ERRO: {erro}")
    print(f"Validação estrutural: {'FALHOU' if erros else 'OK'}")
    raise SystemExit(1 if erros else 0)
