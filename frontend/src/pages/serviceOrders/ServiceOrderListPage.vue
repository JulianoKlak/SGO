<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Ordens de Serviço</div>
      <q-btn color="primary" icon="add" label="Nova OS" unelevated @click="$router.push('/service-orders/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="orderStore.orders"
        :columns="columns"
        row-key="id"
        :loading="orderStore.loading"
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
              placeholder="Buscar OS..."
              outlined
              dense
              style="width: 200px"
              @update:model-value="onSearch"
            >
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Status"
              outlined
              dense
              clearable
              style="width: 160px"
              @update:model-value="onSearch"
            />
          </div>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <StatusBadge :status="props.row.status" />
          </q-td>
        </template>

        <template #body-cell-total="props">
          <q-td :props="props">{{ formatCurrency(props.row.total_amount || props.row.total) }}</q-td>
        </template>

        <template #body-cell-date="props">
          <q-td :props="props">{{ formatDate(props.row.created_at) }}</q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="visibility" color="primary" size="sm" @click="$router.push(`/service-orders/${props.row.id}`)">
              <q-tooltip>Ver Detalhes</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" color="secondary" size="sm" @click="$router.push(`/service-orders/${props.row.id}/edit`)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey-6">
            <q-icon name="assignment" size="48px" class="q-mb-sm" />
            <div>Nenhuma OS encontrada</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useServiceOrderStore } from '../../stores/serviceOrder.store'
import StatusBadge from '../../components/common/StatusBadge.vue'

const $q = useQuasar()
const orderStore = useServiceOrderStore()
const search = ref('')
const filterStatus = ref(null)
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const statusOptions = [
  { value: 'open', label: 'Aberta' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' }
]

const columns = [
  { name: 'id', label: 'Código', field: 'id', align: 'center', sortable: true },
  { name: 'client', label: 'Cliente', field: row => row.client?.name || '-', align: 'left' },
  { name: 'vehicle', label: 'Veículo', field: row => row.vehicle ? `${row.vehicle.plate} - ${row.vehicle.model || ''}` : '-', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'date', label: 'Abertura', field: 'created_at', align: 'center' },
  { name: 'total', label: 'Total', field: 'total_amount', align: 'right' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '-'

async function loadOrders() {
  await orderStore.fetchOrders({
    page: pagination.value.page,
    per_page: pagination.value.rowsPerPage,
    search: search.value || undefined,
    status: filterStatus.value || undefined
  })
  pagination.value.rowsNumber = orderStore.total
}

function onRequest(props) {
  pagination.value = props.pagination
  loadOrders()
}

function onSearch() {
  pagination.value.page = 1
  loadOrders()
}

function confirmDelete(order) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir a OS #${order.id}?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await orderStore.deleteOrder(order.id)
      $q.notify({ type: 'positive', message: 'OS excluída com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir OS' })
    }
  })
}

onMounted(() => loadOrders())
</script>
