<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSessao } from './sessao.js'
const sessao = useSessao()
const router = useRouter()
onMounted(() => window.addEventListener('storage', sessao.sincronizar))
onUnmounted(() => window.removeEventListener('storage', sessao.sincronizar))
watch(() => sessao.usuario, (usuario) => { if (!usuario && router.currentRoute.value.meta.protegida) router.replace('/login') })
async function sair() { const encerrando = sessao.sair(); await router.replace('/login'); await encerrando }
</script>
<template>
  <v-app>
    <v-app-bar title="Laboratório de clientes">
      <template #append>
        <v-btn
          v-if="sessao.usuario"
          data-testid="sair"
          @click="sair"
        >
          Sair
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
