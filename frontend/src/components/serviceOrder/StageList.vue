<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-bold">Etapas</div>
      <q-btn flat icon="add" label="Nova Etapa" color="primary" @click="openAddStage" />
    </div>

    <div v-if="!stages.length" class="text-grey-5 text-center q-pa-md">
      Nenhuma etapa cadastrada. Adicione etapas para organizar as tarefas.
    </div>

    <q-expansion-item
      v-for="stage in stages"
      :key="stage.id"
      :label="stage.name"
      class="q-mb-sm border-radius-md overflow-hidden"
      header-class="bg-grey-2"
      expand-icon-class="text-primary"
    >
      <template #header>
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ stage.name }}</q-item-label>
          <q-item-label caption>
            <ProgressBar :percentage="stageProgress(stage)" />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center q-gutter-xs">
            <q-btn flat round dense icon="delete" size="sm" color="negative" @click.stop="deleteStage(stage)" />
          </div>
        </q-item-section>
      </template>

      <q-card flat class="bg-grey-1">
        <q-card-section>
          <TaskList
            :stage="stage"
            :tasks="stage.tasks || []"
            @refresh="$emit('refresh')"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Add Stage Dialog -->
    <q-dialog v-model="showAddStage">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova Etapa</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="stageForm.name" label="Nome da Etapa *" outlined autofocus />
          <q-input v-model="stageForm.description" label="Descrição" outlined class="q-mt-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Criar" :loading="saving" @click="confirmAddStage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useServiceOrderStore } from '../../stores/serviceOrder.store'
import TaskList from './TaskList.vue'
import ProgressBar from '../common/ProgressBar.vue'

const props = defineProps({
  orderId: { type: [String, Number], required: true },
  stages: { type: Array, default: () => [] }
})
const emit = defineEmits(['refresh'])

const $q = useQuasar()
const orderStore = useServiceOrderStore()
const showAddStage = ref(false)
const saving = ref(false)
const stageForm = ref({ name: '', description: '' })

function stageProgress(stage) {
  const tasks = stage.tasks || []
  if (!tasks.length) return 0
  const done = tasks.filter(t => t.status === 'completed').length
  return Math.round((done / tasks.length) * 100)
}

function openAddStage() {
  stageForm.value = { name: '', description: '' }
  showAddStage.value = true
}

async function confirmAddStage() {
  if (!stageForm.value.name) return
  saving.value = true
  try {
    await orderStore.createStage(props.orderId, stageForm.value)
    showAddStage.value = false
    $q.notify({ type: 'positive', message: 'Etapa criada!' })
    emit('refresh')
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao criar etapa' })
  } finally {
    saving.value = false
  }
}

async function deleteStage(stage) {
  $q.dialog({
    title: 'Excluir Etapa',
    message: `Excluir a etapa "${stage.name}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await orderStore.deleteStage(props.orderId, stage.id)
      $q.notify({ type: 'positive', message: 'Etapa excluída!' })
      emit('refresh')
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir etapa' })
    }
  })
}
</script>
