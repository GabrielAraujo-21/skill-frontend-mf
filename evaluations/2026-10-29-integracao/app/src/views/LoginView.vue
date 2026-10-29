<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessao } from '../sessao.js'
import { mensagemErro } from '../api.js'
const sessao = useSessao()
const router = useRouter()
const email = ref('')
const senha = ref('')
const enviando = ref(false)
const erro = ref('')
async function entrar() {
  if (enviando.value) return
  enviando.value = true; erro.value = ''
  try { if (await sessao.entrar(email.value, senha.value)) await router.push('/clientes') }
  catch (falha) { erro.value = mensagemErro(falha) }
  finally { enviando.value = false; senha.value = '' }
}
async function reconciliar() { enviando.value = true; await sessao.sair(); enviando.value = false }
</script>
<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="8"
      md="5"
    >
      <h1 class="text-h4 mb-6">
        Entrar
      </h1>
      <v-alert
        v-if="sessao.pendente"
        type="warning"
        class="mb-4"
        data-testid="logout-pendente"
      >
        Os dados locais foram limpos. O encerramento no servidor ainda não foi confirmado.
        <v-btn
          class="mt-3"
          :loading="enviando"
          aria-label="Tentar encerrar novamente"
          @click="reconciliar"
        >
          Tentar encerrar novamente
          <template #loader>
            <v-progress-circular
              indeterminate
              :size="24"
              :width="2"
              aria-label="Encerrando sessão no servidor"
            />
          </template>
        </v-btn>
      </v-alert>
      <v-alert
        v-if="sessao.indisponivel"
        type="warning"
        class="mb-4"
      >
        Não foi possível verificar a sessão. Nenhum dado protegido foi carregado.
      </v-alert>
      <v-alert
        v-if="erro"
        type="error"
        class="mb-4"
        role="alert"
      >
        {{ erro }}
      </v-alert>
      <v-form @submit.prevent="entrar">
        <v-text-field
          v-model="email"
          label="E-mail"
          type="email"
          autocomplete="username"
          :disabled="sessao.pendente"
          required
        />
        <v-text-field
          v-model="senha"
          label="Senha"
          type="password"
          autocomplete="current-password"
          :disabled="sessao.pendente"
          required
        />
        <v-btn
          type="submit"
          :loading="enviando"
          :disabled="sessao.pendente"
          block
          aria-label="Entrar"
        >
          Entrar
          <template #loader>
            <v-progress-circular
              indeterminate
              :size="24"
              :width="2"
              aria-label="Verificando acesso"
            />
          </template>
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
