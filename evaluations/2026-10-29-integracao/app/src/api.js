import axios from 'axios'

export const api = axios.create({ baseURL: '/', withCredentials: true, withXSRFToken: true, headers: { Accept: 'application/json' } })

export async function autenticar(email, password) {
  await api.get('/sanctum/csrf-cookie')
  await api.post('/api/login', { email, password })
  return (await api.get('/api/me')).data
}

export function mensagemErro(erro) {
  if (erro.response?.status === 422) return 'Confira os campos informados.'
  if (erro.response?.status === 403) return 'Você não tem permissão para esta operação.'
  if (erro.response?.status === 401) return 'Sua sessão expirou. Entre novamente.'
  return 'Não foi possível concluir. Confira a conexão e tente novamente.'
}
