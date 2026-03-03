<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar Serviço' : 'Novo Serviço' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            class="col-12 col-md-6"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
          <q-input
            v-model.number="form.price"
            label="Preço"
            outlined
            class="col-12 col-md-3"
            type="number"
            step="0.01"
            prefix="R$"
          />
          <div class="col-12 col-md-2 flex items-center">
            <q-toggle v-model="form.status" :label="form.status ? 'Ativo' : 'Inativo'" color="positive" />
          </div>
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.description"
            label="Descrição *"
            outlined
            class="col-12"
            type="textarea"
            rows="4"
            :rules="[v => !!v || 'Descrição é obrigatória']"
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
import { useServiceStore } from '../../stores/service.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({ name: '', description: '', price: 0, status: true })

onMounted(async () => {
  if (isEdit.value) {
    try {
      const service = await serviceStore.fetchService(route.params.id)
      Object.assign(form.value, service)
      form.value.status = Number(service.status ?? 1) === 1
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar serviço' })
      router.push('/services')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      price: form.value.price !== null && form.value.price !== '' ? Number(form.value.price) : undefined,
      status: form.value.status ? 1 : 0
    }

    if (isEdit.value) {
      await serviceStore.updateService(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Serviço atualizado com sucesso!' })
    } else {
      await serviceStore.createService(payload)
      $q.notify({ type: 'positive', message: 'Serviço criado com sucesso!' })
    }
    router.push('/services')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar serviço' })
  } finally {
    loading.value = false
  }
}
</script>
