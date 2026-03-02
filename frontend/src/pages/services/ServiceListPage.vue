<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Serviços</div>
      <q-btn color="primary" icon="add" label="Novo Serviço" unelevated @click="$router.push('/services/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="serviceStore.services"
        :columns="columns"
        row-key="id"
        :loading="serviceStore.loading"
        :rows-per-page-options="[10, 25, 50]"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
      >
        <template #top-left>
          <q-input
            v-model="search"
            debounce="400"
            placeholder="Buscar serviços..."
            outlined
            dense
            style="width: 280px"
            @update:model-value="onSearch"
          >
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>

        <template #body-cell-price="props">
          <q-td :props="props">{{ formatCurrency(props.row.price) }}</q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <StatusBadge :status="props.row.status ? 'active' : 'inactive'" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="$router.push(`/services/${props.row.id}/edit`)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey-6">
            <q-icon name="build" size="48px" class="q-mb-sm" />
            <div>Nenhum serviço encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useServiceStore } from '../../stores/service.store'
import StatusBadge from '../../components/common/StatusBadge.vue'

const $q = useQuasar()
const serviceStore = useServiceStore()
const search = ref('')
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

async function loadServices() {
  await serviceStore.fetchServices({
    page: pagination.value.page,
    per_page: pagination.value.rowsPerPage,
    search: search.value || undefined
  })
  pagination.value.rowsNumber = serviceStore.total
}

function onRequest(props) {
  pagination.value = props.pagination
  loadServices()
}

function onSearch() {
  pagination.value.page = 1
  loadServices()
}

function confirmDelete(service) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir o serviço "${service.name}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await serviceStore.deleteService(service.id)
      $q.notify({ type: 'positive', message: 'Serviço excluído com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir serviço' })
    }
  })
}

onMounted(() => loadServices())
</script>
