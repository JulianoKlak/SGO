<template>
  <div class="progress-bar-wrapper">
    <div class="row items-center q-gutter-sm">
      <q-linear-progress
        :value="percentage / 100"
        :color="progressColor"
        class="col stage-progress"
        size="8px"
        rounded
      />
      <span class="text-caption text-weight-bold" style="min-width: 36px;">{{ percentage }}%</span>
    </div>
    <div v-if="label" class="text-caption text-grey-6 q-mt-xs">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  percentage: { type: Number, default: 0 },
  label: { type: String, default: '' }
})

const progressColor = computed(() => {
  if (props.percentage >= 100) return 'green-6'
  if (props.percentage >= 50) return 'orange-6'
  return 'blue-5'
})
</script>
