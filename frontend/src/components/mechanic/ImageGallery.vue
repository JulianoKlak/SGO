<template>
  <div>
    <div v-if="loading" class="text-center q-pa-sm">
      <q-spinner size="20px" color="primary" />
    </div>

    <div v-else>
      <div class="row q-gutter-xs q-mb-sm flex-wrap">
        <q-img
          v-for="img in images"
          :key="img.id"
          :src="img.url || img.image_url"
          style="width: 80px; height: 80px; border-radius: 6px; cursor: pointer;"
          fit="cover"
          @click="openImage(img)"
        />
      </div>

      <div v-if="!images.length" class="text-caption text-grey-5 q-mb-sm">Nenhuma imagem.</div>

      <q-file
        v-model="uploadFile"
        label="Enviar imagem"
        outlined
        dense
        accept="image/*"
        @update:model-value="uploadImage"
      >
        <template #prepend><q-icon name="attach_file" /></template>
      </q-file>
    </div>

    <!-- Preview Dialog -->
    <q-dialog v-model="showPreview">
      <q-card>
        <q-img :src="previewUrl" style="max-width: 90vw; max-height: 80vh;" fit="contain" />
        <q-card-actions align="center">
          <q-btn flat label="Fechar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import * as taskService from '../../services/task.service'

const props = defineProps({
  taskId: { type: [String, Number], required: true }
})

const $q = useQuasar()
const images = ref([])
const loading = ref(false)
const uploadFile = ref(null)
const showPreview = ref(false)
const previewUrl = ref('')

async function loadImages() {
  loading.value = true
  try {
    const res = await taskService.getImages(props.taskId)
    images.value = res.data.data || res.data
  } catch {
    images.value = []
  } finally {
    loading.value = false
  }
}

async function uploadImage(file) {
  if (!file) return
  const formData = new FormData()
  formData.append('image', file)
  try {
    await taskService.uploadImage(props.taskId, formData)
    uploadFile.value = null
    await loadImages()
    $q.notify({ type: 'positive', message: 'Imagem enviada!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao enviar imagem' })
  }
}

function openImage(img) {
  previewUrl.value = img.url || img.image_url
  showPreview.value = true
}

onMounted(() => loadImages())
</script>
