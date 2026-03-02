<template>
  <q-card class="kanban-card q-mb-sm">
    <q-card-section class="q-pb-xs">
      <div class="row items-center justify-between">
        <span class="text-weight-bold text-body2">OS #{{ card.order_id || card.id }}</span>
        <StatusBadge :status="card.status || 'pending'" />
      </div>
      <div class="text-caption text-grey-6 q-mt-xs">{{ card.name || card.description }}</div>
    </q-card-section>

    <q-expansion-item
      v-if="card.stages?.length"
      icon="layers"
      :label="`${card.stages.length} etapa(s)`"
      dense
      header-class="text-caption"
    >
      <q-card-section class="q-pt-xs">
        <div v-for="stage in card.stages" :key="stage.id" class="q-mb-sm">
          <div class="text-caption text-weight-medium q-mb-xs">{{ stage.name }}</div>
          <ProgressBar :percentage="stageProgress(stage)" class="q-mb-xs" />
          <div v-for="task in stage.tasks || []" :key="task.id" class="q-ml-sm">
            <TaskCheckbox
              :task="task"
              @complete="$emit('task-complete', task.id)"
            />
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>

    <q-expansion-item
      icon="comment"
      label="Comentários"
      dense
      header-class="text-caption"
    >
      <q-card-section class="q-pt-xs">
        <CommentSection :task-id="card.id" />
      </q-card-section>
    </q-expansion-item>

    <q-expansion-item
      icon="photo_library"
      label="Imagens"
      dense
      header-class="text-caption"
    >
      <q-card-section class="q-pt-xs">
        <ImageGallery :task-id="card.id" />
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import StatusBadge from '../common/StatusBadge.vue'
import ProgressBar from '../common/ProgressBar.vue'
import TaskCheckbox from './TaskCheckbox.vue'
import CommentSection from './CommentSection.vue'
import ImageGallery from './ImageGallery.vue'

defineProps({
  card: { type: Object, required: true }
})
defineEmits(['task-complete', 'refresh'])

function stageProgress(stage) {
  const tasks = stage.tasks || []
  if (!tasks.length) return 0
  const done = tasks.filter(t => t.status === 'completed').length
  return Math.round((done / tasks.length) * 100)
}
</script>
