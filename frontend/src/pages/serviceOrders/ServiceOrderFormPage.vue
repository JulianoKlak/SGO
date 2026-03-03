<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar OS' : 'Nova Ordem de Serviço' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="text-subtitle1 text-weight-bold q-mb-sm">Dados Principais</div>
        <div class="row q-gutter-md">
          <q-select
            v-model="form.client_id"
            :options="clientOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Cliente *"
            outlined
            class="col-12 col-md-5"
            :rules="[v => !!v || 'Cliente é obrigatório']"
            use-input
            input-debounce="300"
            @filter="filterClients"
            @update:model-value="onClientChange"
          />
          <q-select
            v-model="form.vehicle_id"
            :options="vehicleOptions"
            option-value="id"
            :option-label="v => v.plate + (v.model ? ` - ${v.model}` : '')"
            emit-value
            map-options
            label="Veículo"
            outlined
            class="col-12 col-md-5"
            clearable
            :disable="!form.client_id"
            :loading="loadingVehicles"
            :rules="[v => !!v || 'Veículo é obrigatório']"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.notes"
            label="Observações"
            outlined
            class="col-12"
            type="textarea"
            rows="3"
          />
        </div>

        <div v-if="!isEdit" class="row q-gutter-md">
          <div class="col-12">
            <q-banner class="bg-blue-1 text-blue-9 rounded-borders">
              <template #avatar><q-icon name="info" /></template>
              A OS será criada com status <strong>Aberta</strong>. Você poderá adicionar produtos, serviços e etapas após a criação.
            </q-banner>
          </div>
        </div>

        <div class="row q-gutter-sm justify-end q-pt-sm">
          <q-btn flat label="Cancelar" @click="$router.back()" />
          <q-btn type="submit" color="primary" :label="isEdit ? 'Salvar' : 'Criar OS'" unelevated :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useServiceOrderStore } from '../../stores/serviceOrder.store'
import { useClientStore } from '../../stores/client.store'
import { useVehicleStore } from '../../stores/vehicle.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const orderStore = useServiceOrderStore()
const clientStore = useClientStore()
const vehicleStore = useVehicleStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const loadingVehicles = ref(false)
const clientOptions = ref([])
const allClients = ref([])
const vehicleOptions = ref([])

const form = ref({ client_id: null, vehicle_id: null, notes: '', status: 'open' })

function filterClients(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    clientOptions.value = allClients.value.filter(c => c.name.toLowerCase().includes(needle))
  })
}

async function onClientChange(clientId) {
  form.value.vehicle_id = null
  vehicleOptions.value = []
  if (!clientId) return
  loadingVehicles.value = true
  try {
    const vehicles = await vehicleStore.fetchClientVehicles(clientId)
    vehicleOptions.value = Array.isArray(vehicles) ? vehicles : []
  } catch {
    vehicleOptions.value = []
  } finally {
    loadingVehicles.value = false
  }
}

onMounted(async () => {
  await clientStore.fetchClients({ per_page: 200 })
  allClients.value = clientStore.clients
  clientOptions.value = allClients.value

  if (isEdit.value) {
    try {
      const order = await orderStore.fetchOrder(route.params.id)
      form.value.client_id = order.client_id
      form.value.vehicle_id = order.vehicle_id
      form.value.notes = order.notes || ''
      if (order.client_id) await onClientChange(order.client_id)
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar OS' })
      router.push('/service-orders')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    const payload = {
      client_id: Number(form.value.client_id),
      vehicle_id: form.value.vehicle_id ? Number(form.value.vehicle_id) : undefined,
      status: form.value.status
    }

    if (!payload.client_id || Number.isNaN(payload.client_id)) {
      throw new Error('Cliente é obrigatório')
    }
    if (!payload.vehicle_id || Number.isNaN(payload.vehicle_id)) {
      throw new Error('Veículo é obrigatório')
    }

    if (isEdit.value) {
      await orderStore.updateOrder(route.params.id, payload)
      $q.notify({ type: 'positive', message: 'OS atualizada com sucesso!' })
      router.push(`/service-orders/${route.params.id}`)
    } else {
      const order = await orderStore.createOrder(payload)
      $q.notify({ type: 'positive', message: 'OS criada com sucesso!' })
      router.push(`/service-orders/${order.id}`)
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar OS' })
  } finally {
    loading.value = false
  }
}
</script>
