import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessao } from '../src/sessao.js'
import { api } from '../src/api.js'

vi.mock('../src/api.js', () => ({ api: { get: vi.fn(), post: vi.fn() }, autenticar: vi.fn() }))
beforeEach(() => {
  const armazenamento = new Map()
  vi.stubGlobal('localStorage', { getItem: chave => armazenamento.get(chave) ?? null, setItem: (chave, valor) => armazenamento.set(chave, valor), removeItem: chave => armazenamento.delete(chave) })
  vi.clearAllMocks()
  setActivePinia(createPinia())
})
describe('sessão real Pinia', () => {
  it('limpa antes de aguardar rede e impede restauração após falha e nova instância', async () => {
    const sessao = useSessao()
    sessao.usuario = { id: 1, tenant_id: 1 }; sessao.clientes = [{ id: 1 }]
    api.get.mockResolvedValue({})
    api.post.mockRejectedValue(new Error('offline'))
    const pendente = sessao.sair()
    expect(sessao.usuario).toBeNull(); expect(sessao.clientes).toEqual([])
    expect(await pendente).toBe(false)
    setActivePinia(createPinia())
    const recarga = useSessao()
    expect(recarga.pendente).toBe(true)
    await recarga.verificar()
    expect(api.get).toHaveBeenCalledTimes(1)
    api.post.mockResolvedValue({})
    expect(await recarga.sair()).toBe(true)
    expect(recarga.pendente).toBe(false)
  })
  it('descarta resposta antiga após logout', async () => {
    const sessao = useSessao(); sessao.usuario = { id: 1 }
    let resolver
    api.get.mockImplementationOnce(() => new Promise(resolve => { resolver = resolve }))
    const carregando = sessao.carregarClientes()
    sessao.limpar()
    resolver({ data: { data: [{ nome: 'antigo' }] } })
    expect(await carregando).toBe(false); expect(sessao.clientes).toEqual([])
  })
  it('falha de identidade não libera dados', async () => {
    const sessao = useSessao()
    api.get.mockRejectedValue(new Error('offline'))
    await sessao.verificar()
    expect(sessao.usuario).toBeNull(); expect(sessao.indisponivel).toBe(true)
  })
  it('logout comunicado por outra aba limpa estado', () => {
    const sessao = useSessao(); sessao.usuario = { id: 1 }; sessao.clientes = [{ id: 1 }]
    sessao.sincronizar({ key: 'laboratorio:logout-pendente:v1', newValue: '1' })
    expect(sessao.usuario).toBeNull(); expect(sessao.clientes).toEqual([]); expect(sessao.pendente).toBe(true)
  })
  it('reconcilia sessão já encerrada conforme contrato 401, mas não 419', async () => {
    const sessao = useSessao()
    api.get.mockResolvedValue({})
    api.post.mockRejectedValueOnce({ response: { status: 419 } })
    expect(await sessao.sair()).toBe(false)
    expect(sessao.pendente).toBe(true)
    api.post.mockRejectedValueOnce({ response: { status: 401 } })
    expect(await sessao.sair()).toBe(true)
    expect(sessao.pendente).toBe(false)
  })
})
