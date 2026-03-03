<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar Veículo' : 'Novo Veículo' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.plate"
            label="Placa *"
            outlined
            class="col-12 col-md-3"
            :rules="[v => !!v || 'Placa é obrigatória', v => isValidPlate(v) || 'Formato: AAA-1234 ou AAA-1A23']"
            maxlength="8"
            @blur="form.plate = normalizePlate(form.plate)"
          />
          <q-input v-model="form.brand" label="Marca" outlined class="col-12 col-md-3" />
          <q-input v-model="form.model" label="Modelo" outlined class="col-12 col-md-4" />
          <q-input v-model.number="form.year" label="Ano" outlined class="col-12 col-md-1" type="number" />
        </div>

        <div class="row q-gutter-md">
          <q-select
            v-model="form.client_id"
            :options="clientOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Cliente"
            outlined
            class="col-12 col-md-6"
            clearable
            use-input
            input-debounce="300"
            :rules="[v => v !== null && v !== undefined || 'Cliente é obrigatório']"
            @filter="filterClients"
          />
          <q-input v-model="form.color" label="Cor" outlined class="col-12 col-md-2" />
          <q-input v-model.number="form.mileage" label="Quilometragem" outlined class="col-12 col-md-3" type="number" />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.chassis" label="Chassi" outlined class="col-12 col-md-5" />
          <q-input v-model="form.fuel" label="Combustível" outlined class="col-12 col-md-3" />
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
import { useVehicleStore } from '../../stores/vehicle.store'
import { useClientStore } from '../../stores/client.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const vehicleStore = useVehicleStore()
const clientStore = useClientStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const clientOptions = ref([])
const allClients = ref([])

const form = ref({
  plate: '', brand: '', model: '', year: null,
  client_id: null, color: '', mileage: null, chassis: '', fuel: ''
})

function normalizePlate(value) {
  const raw = String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
  if (raw.length === 7) {
    return `${raw.slice(0, 3)}-${raw.slice(3)}`
  }
  return String(value || '').toUpperCase().trim()
}

function isValidPlate(value) {
  const plate = normalizePlate(value)
  return /^(?:[A-Z]{3}-\d{4}|[A-Z]{3}-\d[A-Z]\d{2})$/.test(plate)
}

function filterClients(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    clientOptions.value = allClients.value.filter(c => c.name.toLowerCase().includes(needle))
  })
}

onMounted(async () => {
  await clientStore.fetchClients({ per_page: 200 })
  allClients.value = clientStore.clients
  clientOptions.value = allClients.value

  if (isEdit.value) {
    try {
      const vehicle = await vehicleStore.fetchVehicle(route.params.id)
      Object.assign(form.value, vehicle)
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar veículo' })
      router.push('/vehicles')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      plate: normalizePlate(form.value.plate),
      year: form.value.year ? Number(form.value.year) : undefined,
      client_id: form.value.client_id !== null ? Number(form.value.client_id) : null
    }

    if (isEdit.value) {
      await vehicleStore.updateVehicle(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'Veículo atualizado com sucesso!' })
    } else {
      if (payload.client_id === null || Number.isNaN(payload.client_id)) {
        throw new Error('Cliente é obrigatório')
      }
      await vehicleStore.createVehicle(payload)
      $q.notify({ type: 'positive', message: 'Veículo criado com sucesso!' })
    }
    router.push('/vehicles')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar veículo' })
  } finally {
    loading.value = false
  }
}
</script>
