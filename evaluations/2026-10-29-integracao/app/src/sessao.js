import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, autenticar } from './api.js'

const CHAVE = 'laboratorio:logout-pendente:v1'
function pendenciaSalva() {
  try { return localStorage.getItem(CHAVE) === '1' } catch { return true }
}

export const useSessao = defineStore('sessao', () => {
  const usuario = ref(null)
  const clientes = ref([])
  const pendente = ref(pendenciaSalva())
  const verificada = ref(false)
  const geracao = ref(0)
  const indisponivel = ref(false)

  function limpar() { geracao.value++; usuario.value = null; clientes.value = [] }
  function guardarPendencia(valor) {
    pendente.value = valor
    try { if (valor) localStorage.setItem(CHAVE, '1'); else localStorage.removeItem(CHAVE) } catch { /* Não armazenar dados privados; manter memória bloqueada. */ }
  }
  async function verificar() {
    if (verificada.value || pendente.value) return
    const atual = geracao.value
    try {
      const resposta = await api.get('/api/me')
      if (atual === geracao.value && !pendente.value) usuario.value = resposta.data
      indisponivel.value = false
    } catch (erro) {
      if (atual === geracao.value) { usuario.value = null; indisponivel.value = erro.response?.status !== 401 }
    } finally { verificada.value = true }
  }
  async function entrar(email, password) {
    if (pendente.value) throw new Error('Encerramento remoto pendente')
    limpar()
    const atual = geracao.value
    const dados = await autenticar(email, password)
    if (atual !== geracao.value || pendente.value) return false
    usuario.value = dados; verificada.value = true; indisponivel.value = false
    return true
  }
  async function sair() {
    guardarPendencia(true); limpar(); verificada.value = true
    try {
      await api.get('/sanctum/csrf-cookie')
      await api.post('/api/logout')
      guardarPendencia(false)
      return true
    } catch (erro) {
      // Contrato do laboratório: 401 nesta rota confirma sessão já encerrada.
      if (erro.response?.status === 401) { guardarPendencia(false); return true }
      return false
    }
  }
  async function carregarClientes() {
    const atual = geracao.value
    const identidade = usuario.value?.id
    if (!identidade || pendente.value) return false
    try {
      const resposta = await api.get('/api/clientes')
      if (atual !== geracao.value || identidade !== usuario.value?.id || pendente.value) return false
      clientes.value = resposta.data.data
      return true
    } catch (erro) {
      if (atual !== geracao.value) return false
      if (erro.response?.status === 401) limpar()
      throw erro
    }
  }
  function sincronizar(evento) {
    if (evento.key === CHAVE && evento.newValue === '1') { pendente.value = true; limpar(); verificada.value = true }
  }
  return { usuario, clientes, pendente, verificada, geracao, indisponivel, limpar, verificar, entrar, sair, carregarClientes, sincronizar }
})
