<template>
  <div class="kanban-board">
    <div
      v-for="col in columns"
      :key="col.status"
      class="kanban-column"
    >
      <div class="kanban-column-header" :style="{ color: col.color }">
        <q-icon :name="col.icon" class="q-mr-xs" />
        {{ col.label }}
        <q-badge :color="col.badgeColor" :label="colCards(col.status).length" class="q-ml-sm" />
      </div>

      <div v-if="!colCards(col.status).length" class="text-grey-5 text-center text-caption q-pa-md">
        Nenhuma tarefa
      </div>

      <KanbanCard
        v-for="card in colCards(col.status)"
        :key="card.id"
        :card="card"
        @task-complete="$emit('task-complete', $event)"
        @refresh="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  orders: { type: Array, default: () => [] }
})
defineEmits(['task-complete', 'refresh'])

const columns = [
  { status: 'pending', label: 'Pendente', icon: 'schedule', color: '#546E7A', badgeColor: 'grey-6' },
  { status: 'in_progress', label: 'Em Andamento', icon: 'autorenew', color: '#E65100', badgeColor: 'orange-7' },
  { status: 'completed', label: 'Concluído', icon: 'check_circle', color: '#2E7D32', badgeColor: 'green-7' }
]

function colCards(status) {
  return props.orders.filter(o => (o.status || 'pending') === status)
}
</script>
