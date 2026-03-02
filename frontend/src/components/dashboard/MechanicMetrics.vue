<template>
  <div>
    <div v-if="loading">
      <q-skeleton v-for="i in 3" :key="i" type="QItem" class="q-mb-sm" />
    </div>
    <div v-else>
      <div v-for="mechanic in mechanics" :key="mechanic.id" class="q-mb-md">
        <div class="row items-center q-mb-xs">
          <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm text-caption">
            {{ mechanic.name?.charAt(0) }}
          </q-avatar>
          <div class="col">
            <div class="text-body2 text-weight-medium">{{ mechanic.name }}</div>
            <div class="text-caption text-grey-6">
              {{ mechanic.completed_tasks || 0 }} concluídas / {{ mechanic.total_tasks || 0 }} total
            </div>
          </div>
          <q-badge color="blue-6" :label="mechanic.pending_tasks || 0" class="q-ml-sm" />
        </div>
        <ProgressBar
          :percentage="taskPercentage(mechanic)"
          :label="''"
        />
      </div>
      <div v-if="!mechanics.length" class="text-grey-5 text-center q-pa-md text-caption">
        Nenhum mecânico cadastrado
      </div>
    </div>
  </div>
</template>

<script setup>
import ProgressBar from '../common/ProgressBar.vue'

const props = defineProps({
  mechanics: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

function taskPercentage(mechanic) {
  const total = mechanic.total_tasks || 0
  const done = mechanic.completed_tasks || 0
  return total > 0 ? Math.round((done / total) * 100) : 0
}
</script>
