<template>
  <div class="mechanic-mobile">
    <div class="text-h6 text-weight-bold q-mb-md">Minhas Ordens de Serviço</div>

    <q-inner-loading :showing="mechanicStore.loading" />

    <div v-if="!mechanicStore.loading && !orders.length" class="text-grey-6 text-center q-pa-md">
      Nenhuma OS disponível para você.
    </div>

    <q-card
      v-for="order in orders"
      :key="order.id"
      class="mobile-order-card q-mb-sm cursor-pointer"
      flat
      bordered
      @click="openOrder(order.id)"
    >
      <q-card-section class="q-py-sm">
        <div class="row items-center justify-between q-mb-xs">
          <div class="text-weight-bold">OS #{{ order.id }}</div>
          <q-badge :color="statusColor(order.status)" :label="statusLabel(order.status)" />
        </div>
        <div class="text-subtitle2 text-weight-medium">{{ order.vehicle?.plate || 'Sem placa' }}</div>
        <div class="text-body2 text-grey-8">
          {{ order.vehicle?.brand || '-' }} {{ order.vehicle?.model || '' }}
        </div>
        <div class="text-caption text-grey-6">
          {{ order.client?.name || 'Cliente não informado' }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMechanicStore } from '../../stores/mechanic.store'

const router = useRouter()
const mechanicStore = useMechanicStore()

const orderPriority = { in_progress: 0, open: 1, pending: 2, completed: 3 }
const orders = computed(() =>
  [...mechanicStore.orders].sort((a, b) => {
    const pa = orderPriority[a.status] ?? 9
    const pb = orderPriority[b.status] ?? 9
    if (pa !== pb) return pa - pb
    return b.id - a.id
  }),
)

const statusLabel = (status) => ({
  pending: 'Pendente',
  open: 'Aberta',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  paid: 'Paga',
}[status] || status)

const statusColor = (status) => ({
  pending: 'grey-6',
  open: 'blue-6',
  in_progress: 'orange-7',
  completed: 'green-7',
  cancelled: 'red-7',
  paid: 'green-9',
}[status] || 'grey-6')

function openOrder(id) {
  router.push(`/mechanic/orders/${id}`)
}

onMounted(() => mechanicStore.fetchOrders())
</script>
