<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Clientes</div>
      <q-btn color="primary" icon="add" label="Novo Cliente" unelevated @click="$router.push('/clients/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="clientStore.clients"
        :columns="columns"
        row-key="id"
        :loading="clientStore.loading"
        :rows-per-page-options="[10, 25, 50]"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
      >
        <template #top-left>
          <q-input
            v-model="search"
            debounce="400"
            placeholder="Buscar clientes..."
            outlined
            dense
            style="width: 280px"
            @update:model-value="onSearch"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="$router.push(`/clients/${props.row.id}/edit`)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey-6">
            <q-icon name="people" size="48px" class="q-mb-sm" />
            <div>Nenhum cliente encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useClientStore } from '../../stores/client.store'

const $q = useQuasar()
const clientStore = useClientStore()
const search = ref('')

const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'city', label: 'Cidade', field: row => `${row.city || ''}${row.state ? '/' + row.state : ''}`, align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

async function loadClients(params = {}) {
  const result = await clientStore.fetchClients({
    page: pagination.value.page,
    per_page: pagination.value.rowsPerPage,
    search: search.value || undefined,
    ...params
  })
  pagination.value.rowsNumber = clientStore.total
}

function onRequest(props) {
  pagination.value = props.pagination
  loadClients()
}

function onSearch() {
  pagination.value.page = 1
  loadClients()
}

function confirmDelete(client) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente excluir o cliente "${client.name}"?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await clientStore.deleteClient(client.id)
      $q.notify({ type: 'positive', message: 'Cliente excluído com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir cliente' })
    }
  })
}

onMounted(() => loadClients())
</script>
