<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useSessao } from '../sessao.js'
import { api, mensagemErro } from '../api.js'
import { validarCnpj, normalizarCnpj } from '../cnpj.js'
import { nomeCliente } from '../cliente.js'
const sessao = useSessao()
const carregando = ref(false)
const enviando = ref(false)
const erro = ref('')
const sucesso = ref('')
const campos = ref({})
const nome = ref('')
const cnpj = ref('')
const editando = ref(null)
const formulario = ref(null)
async function carregar() {
  carregando.value = true; erro.value = ''
  try { await sessao.carregarClientes() } catch (falha) { erro.value = mensagemErro(falha) }
  finally { carregando.value = false }
}
function editar(cliente) { nome.value = cliente.nome; cnpj.value = cliente.cnpj; editando.value = cliente.id; campos.value = {}; sucesso.value = '' }
async function cancelar() {
  nome.value = ''; cnpj.value = ''; editando.value = null; campos.value = {}
  // Esperar os models chegarem aos campos antes de limpar o estado de validação.
  await nextTick()
  formulario.value?.resetValidation()
}
async function salvar() {
  if (enviando.value) return
  const validacao = await formulario.value.validate()
  if (!validacao.valid) return
  enviando.value = true; erro.value = ''; sucesso.value = ''; campos.value = {}
  const atual = sessao.geracao
  try {
    const dados = { nome: nome.value, cnpj: normalizarCnpj(cnpj.value) }
    if (editando.value) await api.put(`/api/clientes/${editando.value}`, dados)
    else await api.post('/api/clientes', dados)
    if (atual !== sessao.geracao) return
    await cancelar(); sucesso.value = 'Cliente salvo.'; await carregar()
  } catch (falha) { if (atual === sessao.geracao) { erro.value = mensagemErro(falha); campos.value = falha.response?.data?.errors ?? {} } }
  finally { enviando.value = false }
}
onMounted(carregar)
</script>
<template>
  <h1 class="text-h4 mb-3">
    Clientes
  </h1>
  <p
    class="mb-6"
    data-testid="identidade"
  >
    {{ sessao.usuario?.nome }} — Organização {{ sessao.usuario?.tenant_id }}
  </p>
  <v-alert
    v-if="erro"
    type="error"
    role="alert"
    class="mb-4"
  >
    {{ erro }}
  </v-alert>
  <v-alert
    v-if="sucesso"
    type="success"
    role="status"
    class="mb-4"
  >
    {{ sucesso }}
  </v-alert>
  <v-row>
    <v-col
      cols="12"
      md="5"
    >
      <v-card :title="editando ? 'Editar cliente' : 'Novo cliente'">
        <v-card-text>
          <v-form
            ref="formulario"
            @submit.prevent="salvar"
          >
            <v-text-field
              v-model="nome"
              label="Nome"
              :rules="[valor => !!valor?.trim() || 'Informe o nome']"
              :error-messages="campos.nome"
            />
            <v-text-field
              v-model="cnpj"
              label="CNPJ"
              hint="Aceita números e letras"
              persistent-hint
              :rules="[valor => validarCnpj(valor) || 'Informe um CNPJ válido']"
              :error-messages="campos.cnpj"
            />
            <v-btn
              type="submit"
              :loading="enviando"
              class="mt-4"
              aria-label="Salvar cliente"
            >
              Salvar cliente
              <template #loader>
                <v-progress-circular
                  indeterminate
                  :size="24"
                  :width="2"
                  aria-label="Salvando cliente"
                />
              </template>
            </v-btn>
            <v-btn
              v-if="editando"
              variant="text"
              class="mt-4"
              @click="cancelar"
            >
              Cancelar edição
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      md="7"
    >
      <div class="d-flex align-center justify-space-between mb-3">
        <h2 class="text-h6">
          Clientes cadastrados
        </h2><v-btn
          variant="text"
          :loading="carregando"
          aria-label="Atualizar lista"
          @click="carregar"
        >
          Atualizar lista
          <template #loader>
            <v-progress-circular
              indeterminate
              :size="24"
              :width="2"
              aria-label="Atualizando lista de clientes"
            />
          </template>
        </v-btn>
      </div>
      <v-progress-linear
        v-if="carregando"
        indeterminate
        aria-label="Carregando clientes"
      />
      <p v-if="!carregando && !sessao.clientes.length">
        Nenhum cliente cadastrado.
      </p>
      <v-list data-testid="clientes">
        <v-list-item
          v-for="cliente in sessao.clientes"
          :key="cliente.id"
          :title="nomeCliente(cliente)"
          :subtitle="cliente.cnpj"
        >
          <template #append>
            <v-btn
              variant="text"
              :aria-label="`Editar ${nomeCliente(cliente)}`"
              @click="editar(cliente)"
            >
              Editar
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
