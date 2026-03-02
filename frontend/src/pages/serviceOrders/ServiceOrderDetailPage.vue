<template>
  <div>
    <div class="row items-center q-mb-md">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/service-orders')" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">OS #{{ route.params.id }}</div>
      <q-space />
      <q-btn outline color="primary" icon="edit" label="Editar" @click="$router.push(`/service-orders/${route.params.id}/edit`)" class="q-mr-sm" />
    </div>

    <q-inner-loading :showing="orderStore.loading" />

    <template v-if="order">
      <!-- Header Info -->
      <div class="row q-gutter-md q-mb-md">
        <q-card class="col-12 col-md-7 erp-card q-pa-md">
          <div class="row q-gutter-md">
            <div class="col">
              <div class="text-caption text-grey-6">Cliente</div>
              <div class="text-body1 text-weight-medium">{{ order.client?.name || '-' }}</div>
            </div>
            <div class="col">
              <div class="text-caption text-grey-6">Veículo</div>
              <div class="text-body1 text-weight-medium">
                {{ order.vehicle ? `${order.vehicle.plate} - ${order.vehicle.model || ''}` : '-' }}
              </div>
            </div>
            <div class="col">
              <div class="text-caption text-grey-6">Data de Abertura</div>
              <div class="text-body1 text-weight-medium">{{ formatDate(order.created_at) }}</div>
            </div>
            <div class="col">
              <div class="text-caption text-grey-6">Total</div>
              <div class="text-body1 text-weight-bold text-primary">{{ formatCurrency(order.total_amount || 0) }}</div>
            </div>
          </div>
        </q-card>

        <!-- Status Card -->
        <q-card class="col-12 col-md-4 erp-card q-pa-md">
          <div class="text-caption text-grey-6 q-mb-sm">Status</div>
          <StatusBadge :status="order.status" class="q-mb-md" size="md" />
          <div class="row q-gutter-sm q-mt-sm">
            <q-btn
              v-for="st in availableStatuses"
              :key="st.value"
              :color="st.color"
              :label="st.label"
              size="sm"
              unelevated
              :disable="order.status === st.value"
              @click="changeStatus(st.value)"
            />
          </div>
        </q-card>
      </div>

      <!-- Products & Services -->
      <div class="row q-gutter-md q-mb-md">
        <!-- Products -->
        <q-card class="col-12 col-md-5 erp-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle1 text-weight-bold">Produtos</div>
              <q-btn flat round dense icon="add" color="primary" @click="openAddProduct">
                <q-tooltip>Adicionar Produto</q-tooltip>
              </q-btn>
            </div>
            <q-list separator>
              <q-item v-for="p in order.products" :key="p.id" dense>
                <q-item-section>
                  <q-item-label>{{ p.product?.name || p.name }}</q-item-label>
                  <q-item-label caption>Qtd: {{ p.quantity }} × {{ formatCurrency(p.unit_price || p.price) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center">
                    <span class="text-weight-medium q-mr-sm">{{ formatCurrency((p.quantity || 1) * (p.unit_price || p.price || 0)) }}</span>
                    <q-btn flat round dense icon="delete" size="xs" color="negative" @click="removeProduct(p.id)" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-if="!order.products?.length" dense>
                <q-item-section class="text-grey-5 text-center">Nenhum produto adicionado</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Services -->
        <q-card class="col-12 col-md-5 erp-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle1 text-weight-bold">Serviços</div>
              <q-btn flat round dense icon="add" color="primary" @click="openAddService">
                <q-tooltip>Adicionar Serviço</q-tooltip>
              </q-btn>
            </div>
            <q-list separator>
              <q-item v-for="s in order.services" :key="s.id" dense>
                <q-item-section>
                  <q-item-label>{{ s.service?.name || s.name }}</q-item-label>
                  <q-item-label caption>{{ formatCurrency(s.unit_price || s.price) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center">
                    <span class="text-weight-medium q-mr-sm">{{ formatCurrency(s.unit_price || s.price || 0) }}</span>
                    <q-btn flat round dense icon="delete" size="xs" color="negative" @click="removeService(s.id)" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-if="!order.services?.length" dense>
                <q-item-section class="text-grey-5 text-center">Nenhum serviço adicionado</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Stages / Tasks -->
      <q-card class="erp-card q-mb-md">
        <q-card-section>
          <StageList :order-id="order.id" :stages="order.stages || []" @refresh="reloadOrder" />
        </q-card-section>
      </q-card>

      <!-- Timeline -->
      <q-card class="erp-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-md">Histórico</div>
          <OrderTimeline :order="order" />
        </q-card-section>
      </q-card>
    </template>

    <!-- Add Product Dialog -->
    <q-dialog v-model="showAddProduct">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adicionar Produto</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="addProductForm.product_id"
            :options="productOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Produto *"
            outlined
            use-input
            @filter="filterProducts"
          />
          <q-input v-model.number="addProductForm.quantity" label="Quantidade" type="number" outlined min="1" />
          <q-input v-model.number="addProductForm.unit_price" label="Preço Unitário" type="number" outlined prefix="R$" step="0.01" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Adicionar" :loading="savingItem" @click="confirmAddProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Service Dialog -->
    <q-dialog v-model="showAddService">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adicionar Serviço</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="addServiceForm.service_id"
            :options="serviceOptions"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Serviço *"
            outlined
            use-input
            @filter="filterServices"
          />
          <q-input v-model.number="addServiceForm.unit_price" label="Preço" type="number" outlined prefix="R$" step="0.01" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Adicionar" :loading="savingItem" @click="confirmAddService" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useServiceOrderStore } from '../../stores/serviceOrder.store'
import { useProductStore } from '../../stores/product.store'
import { useServiceStore } from '../../stores/service.store'
import StatusBadge from '../../components/common/StatusBadge.vue'
import StageList from '../../components/serviceOrder/StageList.vue'
import OrderTimeline from '../../components/serviceOrder/OrderTimeline.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const orderStore = useServiceOrderStore()
const productStore = useProductStore()
const serviceStore = useServiceStore()

const order = computed(() => orderStore.currentOrder)
const showAddProduct = ref(false)
const showAddService = ref(false)
const savingItem = ref(false)
const productOptions = ref([])
const allProducts = ref([])
const serviceOptions = ref([])
const allServices = ref([])
const addProductForm = ref({ product_id: null, quantity: 1, unit_price: 0 })
const addServiceForm = ref({ service_id: null, unit_price: 0 })

const availableStatuses = [
  { value: 'open', label: 'Abrir', color: 'blue-6' },
  { value: 'in_progress', label: 'Iniciar', color: 'orange-6' },
  { value: 'completed', label: 'Concluir', color: 'green-6' },
  { value: 'cancelled', label: 'Cancelar', color: 'red-6' }
]

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '-'

async function reloadOrder() {
  await orderStore.fetchOrder(route.params.id)
}

async function changeStatus(status) {
  try {
    await orderStore.updateOrderStatus(route.params.id, status)
    $q.notify({ type: 'positive', message: 'Status atualizado!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao atualizar status' })
  }
}

function filterProducts(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    productOptions.value = allProducts.value.filter(p => p.name.toLowerCase().includes(needle))
  })
}

function filterServices(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    serviceOptions.value = allServices.value.filter(s => s.name.toLowerCase().includes(needle))
  })
}

function openAddProduct() {
  addProductForm.value = { product_id: null, quantity: 1, unit_price: 0 }
  showAddProduct.value = true
}

function openAddService() {
  addServiceForm.value = { service_id: null, unit_price: 0 }
  showAddService.value = true
}

async function confirmAddProduct() {
  if (!addProductForm.value.product_id) return
  savingItem.value = true
  try {
    await orderStore.addProduct(route.params.id, addProductForm.value)
    showAddProduct.value = false
    $q.notify({ type: 'positive', message: 'Produto adicionado!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao adicionar produto' })
  } finally {
    savingItem.value = false
  }
}

async function confirmAddService() {
  if (!addServiceForm.value.service_id) return
  savingItem.value = true
  try {
    await orderStore.addService(route.params.id, addServiceForm.value)
    showAddService.value = false
    $q.notify({ type: 'positive', message: 'Serviço adicionado!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao adicionar serviço' })
  } finally {
    savingItem.value = false
  }
}

async function removeProduct(productId) {
  try {
    await orderStore.removeProduct(route.params.id, productId)
    $q.notify({ type: 'positive', message: 'Produto removido!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao remover produto' })
  }
}

async function removeService(serviceId) {
  try {
    await orderStore.removeService(route.params.id, serviceId)
    $q.notify({ type: 'positive', message: 'Serviço removido!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao remover serviço' })
  }
}

onMounted(async () => {
  await reloadOrder()
  await Promise.all([
    productStore.fetchProducts({ per_page: 200 }).then(() => {
      allProducts.value = productStore.products
      productOptions.value = allProducts.value
    }),
    serviceStore.fetchServices({ per_page: 200 }).then(() => {
      allServices.value = serviceStore.services
      serviceOptions.value = allServices.value
    })
  ])
})
</script>
