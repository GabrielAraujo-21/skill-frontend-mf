<script setup>
import { onMounted, ref } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { useClientesStore } from '../clientes.store.js'

const clientes = useClientesStore()
const display = useDisplay()
const theme = useTheme()
const nome = ref('')
const tipo = ref('escritorio')
const tipos = [
  { codigo: 'escritorio', rotulo: 'Escritório' },
  { codigo: 'loja', rotulo: 'Loja' },
]
const dialogo = ref(false)
const tipoDialogo = ref(null)
const obrigatorio = (valor) => Boolean(valor) || 'Informe o nome.'

onMounted(() => clientes.carregar())
</script>

<template>
  <v-container>
    <h1 class="text-headline-large mb-4" data-teste="titulo">Clientes</h1>
    <p class="text-body-medium mb-4" data-teste="contexto">
      Tema {{ theme.global.name.value }} · ponto de quebra {{ display.name.value }}
    </p>

    <v-alert v-if="clientes.erro" type="error" class="mb-4" data-teste="erro">{{ clientes.erro }}</v-alert>
    <v-progress-linear v-if="clientes.carregando" indeterminate aria-label="Carregando clientes" />
    <v-list v-else-if="clientes.itens.length" data-teste="lista">
      <v-list-item v-for="item in clientes.itens" :key="item.codigo" :title="item.nome" />
    </v-list>
    <p v-else class="text-body-medium" data-teste="vazio">Nenhum cliente cadastrado.</p>

    <v-form class="mt-6" data-teste="formulario">
      <template #default="{ isValid }">
        <v-row gap="16" data-teste="linha">
          <v-col cols="12" md="6" data-teste="coluna">
            <v-text-field v-model="nome" label="Nome" :rules="[obrigatorio]" data-teste="nome" />
          </v-col>
          <v-col cols="12" md="6" data-teste="coluna">
            <v-select v-model="tipo" label="Tipo" :items="tipos" item-title="rotulo" item-value="codigo" data-teste="tipo">
              <template #item="{ item, internalItem, props: propriedades }">
                <v-list-item v-bind="propriedades" :title="`${item.rotulo} (${internalItem.title})`" />
              </template>
            </v-select>
          </v-col>
        </v-row>
        <p class="text-body-medium" data-teste="validade">Formulário {{ isValid === true ? 'válido' : 'pendente' }}</p>
        <v-btn color="primary" :disabled="isValid !== true" data-teste="salvar">Salvar cliente</v-btn>
        <v-btn class="ml-2" variant="outlined" data-teste="abrir" @click="dialogo = true">Abrir diálogo</v-btn>
      </template>
    </v-form>

    <v-dialog v-model="dialogo" max-width="420">
      <v-card title="Diálogo com seleção">
        <v-card-text>
          <v-select v-model="tipoDialogo" label="Tipo no diálogo" :items="tipos" item-title="rotulo" item-value="codigo" data-teste="tipo-dialogo" />
        </v-card-text>
        <v-card-actions>
          <v-btn data-teste="fechar" @click="dialogo = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
