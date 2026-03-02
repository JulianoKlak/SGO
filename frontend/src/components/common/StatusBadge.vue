<template>
  <q-badge :color="badgeColor" :label="badgeLabel" :class="`status-${status}`" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'open' }
})

const statusMap = {
  open: { label: 'Aberta', color: 'blue-6' },
  in_progress: { label: 'Em Andamento', color: 'orange-7' },
  completed: { label: 'Concluída', color: 'green-7' },
  cancelled: { label: 'Cancelada', color: 'red-7' },
  pending: { label: 'Pendente', color: 'grey-6' },
  blocked: { label: 'Bloqueada', color: 'deep-orange-8' },
  active: { label: 'Ativo', color: 'green-6' },
  inactive: { label: 'Inativo', color: 'grey-5' }
}

const badgeColor = computed(() => statusMap[props.status]?.color || 'grey-5')
const badgeLabel = computed(() => statusMap[props.status]?.label || props.status)
</script>
