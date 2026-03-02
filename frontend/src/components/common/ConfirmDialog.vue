<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ message }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="cancelLabel" @click="onCancel" />
        <q-btn :color="okColor" :label="okLabel" @click="onOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Confirmar' },
  message: { type: String, default: 'Deseja continuar?' },
  okLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  okColor: { type: String, default: 'primary' }
})

const emit = defineEmits(['ok', 'cancel'])
const show = ref(true)

function onOk() {
  show.value = false
  emit('ok')
}

function onCancel() {
  show.value = false
  emit('cancel')
}
</script>
