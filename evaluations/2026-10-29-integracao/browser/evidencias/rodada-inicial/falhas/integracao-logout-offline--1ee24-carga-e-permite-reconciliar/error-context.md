# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integracao.spec.js >> logout offline não restaura dados após recarga e permite reconciliar
- Location: tests\integracao.spec.js:82:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/clientes$/
Received string:  "http://127.0.0.1:15173/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    10 × locator resolved to <html lang="pt-BR">…</html>
       - unexpected value "http://127.0.0.1:15173/login"

```

```yaml
- banner: Laboratório de clientes
- main:
  - heading "Entrar" [level=1]
  - textbox "E-mail": a@example.test
  - text: E-mail
  - alert
  - textbox "Senha": Teste123456!
  - text: Senha
  - alert
  - button "Entrar":
    - text: Entrar
    - progressbar:
      - img
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | async function entrar(page, email = 'a@example.test') {
  5   |   await page.goto('/login');
  6   |   await page.getByLabel('E-mail', { exact: true }).fill(email);
  7   |   await page.getByLabel('Senha', { exact: true }).fill('Teste123456!');
  8   |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
> 9   |   await expect(page).toHaveURL(/\/clientes$/);
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  10  |   await expect(page.getByTestId('identidade')).toBeVisible();
  11  | }
  12  | 
  13  | async function requisitar(page, caminho, metodo = 'GET', dados) {
  14  |   return page.evaluate(async ({ caminho, metodo, dados }) => {
  15  |     const csrf = document.cookie.split('; ').find((parte) => parte.startsWith('XSRF-TOKEN='));
  16  |     const resposta = await fetch(caminho, {
  17  |       method: metodo,
  18  |       headers: { Accept: 'application/json', 'Content-Type': 'application/json',
  19  |         ...(csrf ? { 'X-XSRF-TOKEN': decodeURIComponent(csrf.slice('XSRF-TOKEN='.length)) } : {}) },
  20  |       ...(dados ? { body: JSON.stringify(dados) } : {}),
  21  |     });
  22  |     return { status: resposta.status, corpo: await resposta.text() };
  23  |   }, { caminho, metodo, dados });
  24  | }
  25  | 
  26  | test('rota protegida, credencial incorreta e CSRF real', async ({ page }) => {
  27  |   await page.goto('/clientes');
  28  |   await expect(page).toHaveURL(/\/login$/);
  29  |   await page.getByLabel('E-mail', { exact: true }).fill('a@example.test');
  30  |   await page.getByLabel('Senha', { exact: true }).fill('errada');
  31  |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  32  |   await expect(page).toHaveURL(/\/login$/);
  33  |   const status = await page.evaluate(async () => (await fetch('/api/login', {
  34  |     method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  35  |     body: JSON.stringify({ email: 'a@example.test', password: 'Teste123456!' }),
  36  |   })).status);
  37  |   expect(status).toBe(419);
  38  |   expect((await requisitar(page, '/api/clientes')).status).toBe(401);
  39  | });
  40  | 
  41  | test('cadastro CNPJ alfanumérico, edição e isolamento entre organizações', async ({ page }) => {
  42  |   await entrar(page);
  43  |   const nome = `Cliente navegador ${Date.now()}`;
  44  |   await page.getByLabel('Nome', { exact: true }).fill(nome);
  45  |   await page.getByLabel('CNPJ', { exact: true }).fill('12.ABC.345/01DE-35');
  46  |   const criado = page.waitForResponse((r) => r.url().endsWith('/api/clientes') && r.request().method() === 'POST');
  47  |   await page.getByRole('button', { name: 'Salvar cliente', exact: true }).click();
  48  |   const resposta = await criado;
  49  |   expect(resposta.status()).toBe(201);
  50  |   const { data: cliente } = await resposta.json();
  51  |   await expect(page.getByTestId('clientes')).toContainText(nome);
  52  |   await page.getByRole('button', { name: `Editar ${nome}`, exact: true }).click();
  53  |   await page.getByLabel('Nome', { exact: true }).fill(`${nome} atualizado`);
  54  |   await page.getByRole('button', { name: 'Salvar cliente', exact: true }).click();
  55  |   await expect(page.getByTestId('clientes')).toContainText(`${nome} atualizado`);
  56  |   await page.getByRole('button', { name: 'Sair', exact: true }).click();
  57  |   await entrar(page, 'b@example.test');
  58  |   await expect(page.getByTestId('clientes')).not.toContainText(nome);
  59  |   const tentativa = await requisitar(page, `/api/clientes/${cliente.id}`, 'PUT', { nome: 'Ataque sintético', cnpj: cliente.cnpj });
  60  |   expect([403, 404]).toContain(tentativa.status);
  61  | });
  62  | 
  63  | test('validação servidor permanece ativa quando cliente é contornado', async ({ page }) => {
  64  |   await entrar(page);
  65  |   const resposta = await requisitar(page, '/api/clientes', 'POST', { nome: '', cnpj: '12ABC34501DE34' });
  66  |   expect(resposta.status).toBe(422);
  67  |   const dados = JSON.parse(resposta.corpo);
  68  |   expect(dados.errors).toHaveProperty('nome');
  69  |   expect(dados.errors).toHaveProperty('cnpj');
  70  | });
  71  | 
  72  | test('logout real revoga sessão e impede retorno após recarga', async ({ page }) => {
  73  |   await entrar(page);
  74  |   await page.getByRole('button', { name: 'Sair', exact: true }).click();
  75  |   await expect(page).toHaveURL(/\/login$/);
  76  |   expect((await requisitar(page, '/api/me')).status).toBe(401);
  77  |   await page.reload();
  78  |   await expect(page).toHaveURL(/\/login$/);
  79  |   await expect(page.getByTestId('clientes')).toHaveCount(0);
  80  | });
  81  | 
  82  | test('logout offline não restaura dados após recarga e permite reconciliar', async ({ page }) => {
  83  |   await entrar(page);
  84  |   await page.route('**/api/logout', (rota) => rota.abort('failed'));
  85  |   await page.getByRole('button', { name: 'Sair', exact: true }).click();
  86  |   await expect(page).toHaveURL(/\/login$/);
  87  |   await expect(page.getByTestId('logout-pendente')).toBeVisible();
  88  |   await page.reload();
  89  |   await expect(page.getByTestId('logout-pendente')).toBeVisible();
  90  |   await expect(page.getByTestId('clientes')).toHaveCount(0);
  91  |   await page.unroute('**/api/logout');
  92  |   await page.getByRole('button', { name: /Tentar encerrar|Reconciliar|Tentar novamente/i }).click();
  93  |   await expect(page.getByTestId('logout-pendente')).toHaveCount(0);
  94  |   expect((await requisitar(page, '/api/me')).status).toBe(401);
  95  | });
  96  | 
  97  | test('resposta antiga após logout e troca de conta não repovoa a tela', async ({ page }) => {
  98  |   await entrar(page);
  99  |   await expect(page.getByRole('button', { name: 'Atualizar lista' })).toBeEnabled();
  100 |   let liberar;
  101 |   let recebida;
  102 |   let nomesAntigos = [];
  103 |   const chegou = new Promise((resolve) => { recebida = resolve; });
  104 |   const aguardar = new Promise((resolve) => { liberar = resolve; });
  105 |   await page.route('**/api/clientes', async (rota) => {
  106 |     const resposta = await rota.fetch();
  107 |     nomesAntigos = (await resposta.json()).data.map((cliente) => cliente.nome);
  108 |     recebida();
  109 |     await aguardar;
```