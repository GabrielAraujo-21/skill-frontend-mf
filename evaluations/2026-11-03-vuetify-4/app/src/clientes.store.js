import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const api = axios.create({ baseURL: '/api/v1', withCredentials: true, withXSRFToken: true })

export const useClientesStore = defineStore('clientes', () => {
  const itens = ref([])
  const carregando = ref(false)
  const erro = ref('')
  let geracao = 0

  async function carregar() {
    const atual = ++geracao
    carregando.value = true
    erro.value = ''
    try {
      const { data } = await api.get('/clientes')
      if (atual === geracao) itens.value = data.data
    } catch {
      if (atual === geracao) erro.value = 'Não foi possível carregar os clientes.'
    } finally {
      if (atual === geracao) carregando.value = false
    }
  }

  function limpar() {
    geracao++
    itens.value = []
    erro.value = ''
    carregando.value = false
  }

  return { itens, carregando, erro, carregar, limpar }
})
