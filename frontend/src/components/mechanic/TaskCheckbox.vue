<template>
  <div class="row items-center q-py-xs">
    <q-checkbox
      v-model="checked"
      :label="task.name"
      :disable="task.status === 'completed'"
      :color="task.status === 'completed' ? 'green-6' : 'primary'"
      keep-color
      @update:model-value="onToggle"
    />
    <q-badge
      v-if="task.status === 'blocked'"
      color="red-6"
      label="Bloqueada"
      class="q-ml-sm"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  task: { type: Object, required: true }
})
const emit = defineEmits(['complete'])

const checked = ref(props.task.status === 'completed')

watch(() => props.task.status, (val) => {
  checked.value = val === 'completed'
})

function onToggle(val) {
  if (props.task.status === 'completed') {
    // Cannot undo completed tasks
    checked.value = true
    return
  }
  if (val) {
    emit('complete', props.task.id)
  }
}
</script>
