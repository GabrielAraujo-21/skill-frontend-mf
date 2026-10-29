"""Regressões do verificador em cópias temporárias, sem rede."""

import importlib.util
import shutil
import tempfile
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
ESPEC_MODULO = importlib.util.spec_from_file_location(
    "validador", RAIZ / "scripts/validar_skill.py"
)
MODULO = importlib.util.module_from_spec(ESPEC_MODULO)
ESPEC_MODULO.loader.exec_module(MODULO)


class TestarValidador(unittest.TestCase):
    def setUp(self):
        self.temporario = tempfile.TemporaryDirectory(prefix="frontend-mf-teste-")
        self.addCleanup(self.temporario.cleanup)
        self.copia = Path(self.temporario.name) / "skill"
        shutil.copytree(
            RAIZ,
            self.copia,
            ignore=shutil.ignore_patterns(".git", "__pycache__", ".ruff_cache"),
        )

    def alterar_entrada(self, transformar):
        entrada = self.copia / "SKILL.md"
        entrada.write_text(
            transformar(entrada.read_text(encoding="utf-8")), encoding="utf-8"
        )

    def test_pacote_valido(self):
        self.assertEqual(MODULO.validar(self.copia), [])

    def test_arquivo_ausente(self):
        (self.copia / "references/projeto-novo.md").unlink()
        self.assertTrue(
            any("Arquivo ausente" in erro for erro in MODULO.validar(self.copia))
        )

    def test_link_inexistente(self):
        self.alterar_entrada(
            lambda texto: texto + "\n[Ausente](references/ausente.md)\n"
        )
        self.assertTrue(
            any(
                "Referência local inválida" in erro
                for erro in MODULO.validar(self.copia)
            )
        )

    def test_link_fora_da_pasta(self):
        (self.copia.parent / "externo.md").write_text("externo", encoding="utf-8")
        self.alterar_entrada(lambda texto: texto + "\n[Externo](../externo.md)\n")
        self.assertTrue(
            any(
                "Referência local inválida" in erro
                for erro in MODULO.validar(self.copia)
            )
        )

    def test_versao_divergente(self):
        self.alterar_entrada(
            lambda texto: texto.replace('version: "1.0.0"', 'version: "9.9.9"')
        )
        self.assertTrue(
            any("Versão do pacote" in erro for erro in MODULO.validar(self.copia))
        )

    def test_frontmatter_ausente(self):
        self.alterar_entrada(lambda texto: texto.removeprefix("---\n"))
        self.assertTrue(
            any("Frontmatter" in erro for erro in MODULO.validar(self.copia))
        )


if __name__ == "__main__":
    unittest.main()
