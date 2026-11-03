import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

export const rotas = [{ path: '/', name: 'clientes', component: () => import('./views/ClientesView.vue') }]

export function criarRouter(memoria = false) {
  return createRouter({ history: memoria ? createMemoryHistory() : createWebHistory(), routes: rotas })
}
