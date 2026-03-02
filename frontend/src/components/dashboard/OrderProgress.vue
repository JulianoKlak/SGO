<template>
  <div>
    <div v-if="loading">
      <q-skeleton v-for="i in 4" :key="i" type="QItem" class="q-mb-sm" />
    </div>
    <q-list v-else separator>
      <q-item v-for="order in orders" :key="order.id" dense>
        <q-item-section>
          <q-item-label>OS #{{ order.id }} — {{ order.client?.name || 'Cliente' }}</q-item-label>
          <q-item-label caption>
            <ProgressBar :percentage="orderProgress(order)" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <StatusBadge :status="order.status" />
        </q-item-section>
      </q-item>
      <q-item v-if="!orders.length" dense>
        <q-item-section class="text-grey-5 text-center text-caption">Nenhuma OS recente</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import ProgressBar from '../common/ProgressBar.vue'
import StatusBadge from '../common/StatusBadge.vue'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function orderProgress(order) {
  const stages = order.stages || []
  if (!stages.length) {
    return order.status === 'completed' ? 100 : order.status === 'in_progress' ? 50 : 0
  }
  const total = stages.reduce((acc, s) => acc + (s.tasks?.length || 0), 0)
  const done = stages.reduce((acc, s) => acc + (s.tasks?.filter(t => t.status === 'completed').length || 0), 0)
  return total > 0 ? Math.round((done / total) * 100) : 0
}
</script>
