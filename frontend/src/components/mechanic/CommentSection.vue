<template>
  <div>
    <div v-if="loading" class="text-center q-pa-sm">
      <q-spinner size="20px" color="primary" />
    </div>

    <div v-else>
      <div v-for="comment in comments" :key="comment.id" class="q-mb-sm">
        <div class="row items-start q-gutter-xs">
          <q-avatar size="24px" color="primary" text-color="white" class="text-caption">
            {{ comment.user?.name?.charAt(0) || 'U' }}
          </q-avatar>
          <div class="col">
            <div class="bg-grey-1 rounded-borders q-pa-xs">
              <span class="text-caption text-weight-medium">{{ comment.user?.name }}</span>
              <div class="text-body2">{{ comment.text }}</div>
            </div>
            <div class="text-caption text-grey-5">{{ formatDate(comment.created_at) }}</div>
          </div>
        </div>
      </div>

      <div v-if="!comments.length" class="text-caption text-grey-5 q-mb-sm">Nenhum comentário.</div>

      <div class="row q-gutter-xs q-mt-sm">
        <q-input
          v-model="newComment"
          placeholder="Escrever comentário..."
          outlined
          dense
          class="col"
          @keyup.enter="addComment"
        />
        <q-btn icon="send" color="primary" dense flat @click="addComment" :disable="!newComment" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as taskService from '../../services/task.service'

const props = defineProps({
  taskId: { type: [String, Number], required: true }
})

const comments = ref([])
const newComment = ref('')
const loading = ref(false)

const formatDate = (date) =>
  date ? new Date(date).toLocaleString('pt-BR') : ''

async function loadComments() {
  loading.value = true
  try {
    const res = await taskService.getComments(props.taskId)
    comments.value = res.data.data || res.data
  } catch {
    comments.value = []
  } finally {
    loading.value = false
  }
}

async function addComment() {
  if (!newComment.value.trim()) return
  try {
    await taskService.addComment(props.taskId, newComment.value.trim())
    newComment.value = ''
    await loadComments()
  } catch {
    // ignore
  }
}

onMounted(() => loadComments())
</script>
