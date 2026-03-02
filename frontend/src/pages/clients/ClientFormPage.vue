<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            class="col-12 col-md-5"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
          <q-input v-model="form.cpf" label="CPF" outlined class="col-12 col-md-3" mask="###.###.###-##" />
          <q-input v-model="form.phone" label="Celular" outlined class="col-12 col-md-3" mask="(##) #####-####" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.homephone" label="Telefone Fixo" outlined class="col-12 col-md-3" mask="(##) ####-####" />
          <q-input v-model="form.fleet_number" label="Nº Frota" outlined class="col-12 col-md-2" />
          <q-input v-model="form.email" label="E-mail" outlined class="col-12 col-md-4" type="email" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.address" label="Endereço" outlined class="col-12 col-md-6" />
          <q-input v-model="form.city" label="Cidade" outlined class="col-12 col-md-3" />
          <q-input v-model="form.state" label="Estado" outlined class="col-12 col-md-1" maxlength="2" />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.customer_report"
            label="Observações"
            outlined
            class="col-12"
            type="textarea"
            rows="3"
          />
        </div>

        <div class="row q-gutter-sm justify-end q-pt-sm">
          <q-btn flat label="Cancelar" @click="$router.back()" />
          <q-btn type="submit" color="primary" :label="isEdit ? 'Salvar' : 'Criar'" unelevated :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useClientStore } from '../../stores/client.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const clientStore = useClientStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({
  name: '', cpf: '', phone: '', homephone: '', fleet_number: '',
  state: '', city: '', email: '', address: '', customer_report: ''
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const client = await clientStore.fetchClient(route.params.id)
      Object.assign(form.value, client)
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar cliente' })
      router.push('/clients')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await clientStore.updateClient(route.params.id, form.value)
      $q.notify({ type: 'positive', message: 'Cliente atualizado com sucesso!' })
    } else {
      await clientStore.createClient(form.value)
      $q.notify({ type: 'positive', message: 'Cliente criado com sucesso!' })
    }
    router.push('/clients')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar cliente' })
  } finally {
    loading.value = false
  }
}
</script>
