import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const clientes = { data: [{ codigo: 'a1', nome: 'Cliente sintético' }] }

async function abrir(page, { esquema = 'light', largura = 1280, altura = 800, resposta = clientes, status = 200 } = {}) {
  await page.emulateMedia({ colorScheme: esquema })
  await page.setViewportSize({ width: largura, height: altura })
  await page.route('**/api/v1/clientes', (rota) => rota.fulfill({ status, json: resposta }))
  await page.goto('/')
  await expect(page.locator('[data-teste="titulo"]')).toBeVisible()
}

async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
}

for (const esquema of ['light', 'dark']) {
  test(`defaultTheme system segue o sistema: ${esquema}, sem violações axe`, async ({ page }) => {
    await abrir(page, { esquema })
    await expect(page.locator('.v-application')).toHaveClass(new RegExp(`v-theme--${esquema}`))
    await expect(page.locator('[data-teste="contexto"]')).toContainText(`Tema ${esquema}`)
    await expect(page.locator('[data-teste="lista"]')).toContainText('Cliente sintético')
    await semViolacoes(page)
    await page.screenshot({ path: `../evidencias/captura-${esquema}.png`, fullPage: true })
  })
}

test('estado de erro e vazio são acessíveis', async ({ page }) => {
  await abrir(page, { status: 500, resposta: {} })
  await expect(page.locator('[data-teste="erro"]')).toContainText('Não foi possível')
  await semViolacoes(page)
})

test('camadas CSS: ordem declarada e utilitários vencem componentes', async ({ page }) => {
  await abrir(page)
  const camadas = await page.evaluate(() => {
    const nomes = []
    for (const folha of document.styleSheets) {
      for (const regra of folha.cssRules) {
        if (regra instanceof CSSLayerStatementRule) nomes.push(...regra.nameList)
        if (regra instanceof CSSLayerBlockRule) nomes.push(regra.name)
      }
    }
    return [...new Set(nomes)]
  })
  expect(camadas.slice(0, 6)).toEqual([
    'vuetify-core', 'vuetify-components', 'vuetify-overrides', 'laboratorio', 'vuetify-utilities', 'vuetify-final',
  ])
  const margem = await page.locator('[data-teste="titulo"]').evaluate((e) => getComputedStyle(e).marginBottom)
  expect(margem).toBe('16px')
})

test('reset reduzido, botão sem caixa alta e tipografia MD3', async ({ page }) => {
  await abrir(page)
  const lido = await page.evaluate(() => {
    const p = document.createElement('p')
    document.body.append(p)
    const margemP = getComputedStyle(p).marginTop
    p.remove()
    const botao = document.querySelector('[data-teste="abrir"]')
    const titulo = document.querySelector('[data-teste="titulo"]')
    return {
      margemP,
      caixa: getComputedStyle(botao).textTransform,
      tamanho: getComputedStyle(titulo).fontSize,
    }
  })
  expect(lido.margemP).not.toBe('0px')
  expect(lido.caixa).toBe('none')
  expect(lido.tamanho).toBe('32px')
})

for (const [largura, nome, lado] of [[839, 'sm', 'empilha'], [840, 'md', 'lado'], [1145, 'lg', 'lado'], [320, 'xs', 'empilha']]) {
  test(`largura ${largura}: ponto ${nome}, grid ${lado}, sem rolagem horizontal`, async ({ page }) => {
    await abrir(page, { largura })
    await expect(page.locator('[data-teste="contexto"]')).toContainText(`ponto de quebra ${nome}`)
    const colunas = await page.locator('[data-teste="coluna"]').all()
    const [a, b] = await Promise.all(colunas.map((c) => c.boundingBox()))
    if (lado === 'lado') expect(Math.round(a.y)).toBe(Math.round(b.y))
    else expect(b.y).toBeGreaterThan(a.y)
    const linha = page.locator('[data-teste="linha"]')
    const estilo = await linha.evaluate((e) => { const c = getComputedStyle(e); return { gap: c.rowGap, margem: c.marginLeft } })
    expect(estilo.gap).toBe('16px')
    expect(estilo.margem).toBe('0px')
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(sobra).toBeLessThanOrEqual(0)
  })
}

test('slot de VSelect recebe item bruto e internalItem; VForm atualiza validade', async ({ page }) => {
  await abrir(page)
  await page.locator('[data-teste="tipo"] .v-field').click()
  await expect(page.getByRole('option', { name: 'Loja (Loja)' })).toBeVisible()
  await page.getByRole('option', { name: 'Loja (Loja)' }).click()
  await expect(page.locator('[data-teste="validade"]')).toContainText('pendente')
  await page.getByLabel('Nome').fill('Novo cliente')
  await expect(page.locator('[data-teste="validade"]')).toContainText('válido')
  await expect(page.locator('[data-teste="salvar"]')).toBeEnabled()
})

test('menu dentro de diálogo fica acima do diálogo e é operável', async ({ page }) => {
  await abrir(page)
  await page.locator('[data-teste="abrir"]').click()
  await page.locator('[data-teste="tipo-dialogo"] .v-field').click()
  const opcao = page.getByRole('option', { name: 'Escritório' })
  await expect(opcao).toBeVisible()
  const indices = await page.evaluate(() => {
    const ativos = [...document.querySelectorAll('.v-overlay--active')]
    return ativos.map((e) => Number(getComputedStyle(e).zIndex))
  })
  expect(indices.length).toBeGreaterThanOrEqual(2)
  expect(Math.max(...indices)).toBeGreaterThan(Math.min(...indices))
  await opcao.click()
  await page.locator('[data-teste="fechar"]').click()
})

test('teclado alcança o formulário com foco visível', async ({ page }) => {
  await abrir(page)
  await page.getByLabel('Nome').focus()
  await page.keyboard.press('Tab')
  const ativo = await page.evaluate(() => document.activeElement?.closest('[data-teste]')?.getAttribute('data-teste'))
  expect(ativo).toBe('tipo')
})
