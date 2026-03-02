<template>
  <div class="order-timeline">
    <div class="timeline-item" v-for="(event, idx) in events" :key="idx">
      <div class="timeline-dot" :style="{ borderColor: event.color, color: event.color }"></div>
      <div class="row items-start q-gutter-sm">
        <q-icon :name="event.icon" :color="event.color.replace('#', '')" size="16px" class="q-mt-xs" />
        <div>
          <div class="text-body2 text-weight-medium">{{ event.label }}</div>
          <div class="text-caption text-grey-6">{{ formatDate(event.date) }}</div>
        </div>
      </div>
    </div>

    <div v-if="!events.length" class="text-grey-5 text-center q-pa-md text-caption">
      Nenhum evento registrado.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})

const statusEvents = {
  open: { label: 'OS Aberta', icon: 'assignment', color: 'blue' },
  in_progress: { label: 'Em Andamento', icon: 'autorenew', color: 'orange' },
  completed: { label: 'Concluída', icon: 'check_circle', color: 'green' },
  cancelled: { label: 'Cancelada', icon: 'cancel', color: 'red' }
}

const events = computed(() => {
  const evs = []
  if (props.order.created_at) {
    evs.push({ label: 'OS Criada', icon: 'add_circle', color: 'blue', date: props.order.created_at })
  }
  if (props.order.updated_at && props.order.status !== 'open') {
    const ev = statusEvents[props.order.status]
    if (ev) evs.push({ ...ev, date: props.order.updated_at })
  }
  return evs
})

const formatDate = (date) =>
  date ? new Date(date).toLocaleString('pt-BR') : '-'
</script>
