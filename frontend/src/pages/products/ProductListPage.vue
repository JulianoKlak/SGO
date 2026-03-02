<template>
  <div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Produtos</div>
      <q-btn color="primary" icon="add" label="Novo Produto" unelevated @click="$router.push('/products/new')" />
    </div>

    <q-card class="erp-table">
      <q-table
        :rows="productStore.products"
        :columns="columns"
        row-key="id"
        :loading="productStore.loading"
        :rows-per-page-options="[10, 25, 50]"
        v-model:pagination="pagination"
        @request="onRequest"
        flat
      >
        <template #top-left>
          <q-input
            v-model="search"
            debounce="400"
            placeholder="Buscar produtos..."
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
            <q-btn flat round dense icon="edit" color="primary" size="sm" @click="$router.push(`/products/${props.row.id}/edit`)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-lg text-grey-6">
            <q-icon name="inventory_2" size="48px" class="q-mb-sm" />
            <div>Nenhum produto encontrado</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../../stores/product.store'
import StatusBadge from '../../components/common/StatusBadge.vue'

const $q = useQuasar()
const productStore = useProductStore()
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

async function loadProducts() {
  await productStore.fetchProducts({
    page: pagination.value.page,
    per_page: pagination.value.rowsPerPage,
    search: search.value || undefined
  })
  pagination.value.rowsNumber = productStore.total
}

function onRequest(props) {
  pagination.value = props.pagination
  loadProducts()
}

function onSearch() {
  pagination.value.page = 1
  loadProducts()
}

function confirmDelete(product) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja excluir o produto "${product.name}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await productStore.deleteProduct(product.id)
      $q.notify({ type: 'positive', message: 'Produto excluído com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir produto' })
    }
  })
}

onMounted(() => loadProducts())
</script>
