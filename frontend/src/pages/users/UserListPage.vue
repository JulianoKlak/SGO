<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Usuários</div>
      <q-btn color="primary" icon="add" label="Novo Usuário" unelevated @click="$router.push('/users/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :rows-per-page-options="[10, 25, 50]"
        v-model:pagination="pagination"
        flat
      >
        <template #top-left>
          <q-input
            v-model="search"
            debounce="400"
            placeholder="Buscar usuários..."
            outlined
            dense
            style="width: 280px"
            @update:model-value="loadUsers"
          >
            <template #append><q-icon name="search" /></template>
          </q-input>
        </template>

        <template #body-cell-type="props">
          <q-td :props="props">
            <q-badge :color="typeColor(props.row.type)" :label="typeLabel(props.row.type)" />
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <StatusBadge :status="props.row.status ? 'active' : 'inactive'" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="$router.push(`/users/${props.row.id}/edit`)">
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
            <div>Nenhum usuário encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../../boot/axios'
import StatusBadge from '../../components/common/StatusBadge.vue'

const $q = useQuasar()
const users = ref([])
const loading = ref(false)
const search = ref('')
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'username', label: 'Usuário', field: 'username', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const typeLabel = (type) => ({ 0: 'Usuário', 1: 'Admin', 2: 'Mecânico' })[type] || 'Usuário'
const typeColor = (type) => ({ 0: 'blue-6', 1: 'deep-orange-6', 2: 'green-6' })[type] || 'blue-6'

async function loadUsers() {
  loading.value = true
  try {
    const response = await api.get('/users', {
      params: { search: search.value || undefined, page: pagination.value.page, per_page: pagination.value.rowsPerPage }
    })
    users.value = response.data.data || response.data
    pagination.value.rowsNumber = response.data.total || users.value.length
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar usuários' })
  } finally {
    loading.value = false
  }
}

function confirmDelete(user) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir o usuário "${user.name}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await api.delete(`/users/${user.id}`)
      $q.notify({ type: 'positive', message: 'Usuário excluído com sucesso!' })
      loadUsers()
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir usuário' })
    }
  })
}

onMounted(() => loadUsers())
</script>
