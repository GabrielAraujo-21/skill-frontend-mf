import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { version } from 'vuetify'
import App from '../src/App.vue'
import { api, useClientesStore } from '../src/clientes.store.js'
import { criarRouter } from '../src/router.js'
import { criarVuetify, tema } from '../src/vuetify.js'
import { VForm } from 'vuetify/components/VForm'
import { h, isRef } from 'vue'

describe('referência Vuetify 4', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('instala a versão maior 4', () => {
    expect(version.split('.')[0]).toBe('4')
  })

  it('declara o tema explicitamente e mantém o padrão system do laboratório', () => {
    expect(tema.defaultTheme).toBe('system')
    expect(criarVuetify().theme.global.name.value).toBe('light')
  })

  it('aplica os novos pontos de quebra', () => {
    const { thresholds } = criarVuetify().display
    expect(thresholds.value).toMatchObject({ sm: 600, md: 840, lg: 1145, xl: 1545, xxl: 2138 })
  })

  it('entrega valores desembrulhados nos slots de VForm', async () => {
    let recebido
    mount({ render: () => h(VForm, null, { default: (slot) => { recebido = slot; return 'x' } }) }, { global: { plugins: [criarVuetify()] } })
    await flushPromises()
    expect(isRef(recebido.isValid)).toBe(false)
    expect(recebido.isValid).toBeNull()
    expect(Array.isArray(recebido.errors)).toBe(true)
  })

  it('monta a fatia com Router, Pinia e Axios sem repovoar resposta antiga', async () => {
    let liberarAntiga
    vi.spyOn(api, 'get')
      .mockImplementationOnce(() => new Promise((resolver) => { liberarAntiga = resolver }))
      .mockResolvedValueOnce({ data: { data: [{ codigo: 'b', nome: 'Conta B' }] } })
    const router = criarRouter(true)
    router.push('/')
    await router.isReady()
    const pinia = createPinia()
    setActivePinia(pinia)
    const app = mount(App, { global: { plugins: [pinia, router, criarVuetify()] } })
    await vi.waitFor(() => expect(api.get).toHaveBeenCalledTimes(1), { timeout: 30000 })
    const store = useClientesStore()
    store.limpar()
    await store.carregar()
    liberarAntiga({ data: { data: [{ codigo: 'a', nome: 'Conta A' }] } })
    await flushPromises()
    expect(store.itens.map((item) => item.nome)).toEqual(['Conta B'])
    expect(app.text()).toContain('Conta B')
    expect(app.text()).not.toContain('Conta A')
  }, 60000)
})
