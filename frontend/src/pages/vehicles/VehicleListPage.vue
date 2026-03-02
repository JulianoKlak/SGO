<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Veículos</div>
      <q-btn color="primary" icon="add" label="Novo Veículo" unelevated @click="$router.push('/vehicles/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="vehicleStore.vehicles"
        :columns="columns"
        row-key="id"
        :loading="vehicleStore.loading"
        :rows-per-page-options="[10, 25, 50]"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
      >
        <template #top-left>
          <div class="row q-gutter-sm">
            <q-input
              v-model="search"
              debounce="400"
              placeholder="Buscar veículos..."
              outlined
              dense
              style="width: 220px"
              @update:model-value="onSearch"
            >
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-select
              v-model="filterClientId"
              :options="clientOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Filtrar por cliente"
              outlined
              dense
              clearable
              style="width: 200px"
              @update:model-value="onSearch"
            />
          </div>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="$router.push(`/vehicles/${props.row.id}/edit`)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey-6">
            <q-icon name="directions_car" size="48px" class="q-mb-sm" />
            <div>Nenhum veículo encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useVehicleStore } from '../../stores/vehicle.store'
import { useClientStore } from '../../stores/client.store'

const $q = useQuasar()
const vehicleStore = useVehicleStore()
const clientStore = useClientStore()

const search = ref('')
const filterClientId = ref(null)
const clientOptions = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const columns = [
  { name: 'plate', label: 'Placa', field: 'plate', align: 'left', sortable: true },
  { name: 'model', label: 'Modelo', field: 'model', align: 'left' },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'left' },
  { name: 'year', label: 'Ano', field: 'year', align: 'center' },
  { name: 'client', label: 'Cliente', field: row => row.client?.name || '-', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

async function loadVehicles(params = {}) {
  await vehicleStore.fetchVehicles({
    page: pagination.value.page,
    per_page: pagination.value.rowsPerPage,
    search: search.value || undefined,
    client_id: filterClientId.value || undefined,
    ...params
  })
  pagination.value.rowsNumber = vehicleStore.total
}

function onRequest(props) {
  pagination.value = props.pagination
  loadVehicles()
}

function onSearch() {
  pagination.value.page = 1
  loadVehicles()
}

function confirmDelete(vehicle) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir o veículo "${vehicle.plate}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await vehicleStore.deleteVehicle(vehicle.id)
      $q.notify({ type: 'positive', message: 'Veículo excluído com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir veículo' })
    }
  })
}

onMounted(async () => {
  await Promise.all([
    loadVehicles(),
    clientStore.fetchClients({ per_page: 100 }).then(() => {
      clientOptions.value = clientStore.clients
    })
  ])
})
</script>
