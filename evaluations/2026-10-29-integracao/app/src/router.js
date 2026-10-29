import { createRouter, createWebHistory } from 'vue-router'
import { useSessao } from './sessao.js'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: () => import('./views/LoginView.vue') },
    { path: '/clientes', name: 'clientes', component: () => import('./views/ClientesView.vue'), meta: { protegida: true } },
    { path: '/:pathMatch(.*)*', redirect: '/clientes' },
  ],
})
router.beforeEach(async (destino) => {
  const sessao = useSessao()
  await sessao.verificar()
  if (destino.meta.protegida && !sessao.usuario) return '/login'
  if (destino.name === 'login' && sessao.usuario) return '/clientes'
})
