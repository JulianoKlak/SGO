<template>
  <div>
    <div class="row items-center justify-between q-mb-sm">
      <span class="text-caption text-grey-6 text-weight-medium">TAREFAS</span>
      <q-btn flat round dense icon="add" size="sm" color="primary" @click="openAddTask">
        <q-tooltip>Adicionar Tarefa</q-tooltip>
      </q-btn>
    </div>

    <div v-if="!tasks.length" class="text-grey-5 text-center q-pa-sm text-caption">
      Nenhuma tarefa nesta etapa.
    </div>

    <q-list separator>
      <q-item v-for="task in tasks" :key="task.id" dense class="q-pa-xs">
        <q-item-section avatar style="min-width: 32px;">
          <q-icon
            :name="task.status === 'completed' ? 'check_circle' : 'radio_button_unchecked'"
            :color="statusColor(task.status)"
            size="20px"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="task.status === 'completed' ? 'text-strike text-grey-5' : ''">{{ task.name }}</q-item-label>
          <q-item-label caption v-if="task.assignee">
            <q-icon name="person" size="12px" /> {{ task.assignee?.name || task.assignee }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center q-gutter-xs">
            <q-badge :color="statusColor(task.status)" :label="statusLabel(task.status)" />
            <q-btn flat round dense icon="delete" size="xs" color="negative" @click="deleteTask(task)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Add Task Dialog -->
    <q-dialog v-model="showAddTask">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Nova Tarefa</div></q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="taskForm.name" label="Nome *" outlined autofocus />
          <q-input v-model="taskForm.description" label="Descrição" outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Criar" :loading="saving" @click="confirmAddTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useServiceOrderStore } from '../../stores/serviceOrder.store'

const props = defineProps({
  stage: { type: Object, required: true },
  tasks: { type: Array, default: () => [] }
})
const emit = defineEmits(['refresh'])

const $q = useQuasar()
const orderStore = useServiceOrderStore()
const showAddTask = ref(false)
const saving = ref(false)
const taskForm = ref({ name: '', description: '' })

const statusColor = (s) => ({ pending: 'grey-5', in_progress: 'blue-5', completed: 'green-6', blocked: 'red-6' })[s] || 'grey-5'
const statusLabel = (s) => ({ pending: 'Pendente', in_progress: 'Em Andamento', completed: 'Concluída', blocked: 'Bloqueada' })[s] || s

function openAddTask() {
  taskForm.value = { name: '', description: '' }
  showAddTask.value = true
}

async function confirmAddTask() {
  if (!taskForm.value.name) return
  saving.value = true
  try {
    await orderStore.createTask(props.stage.id, taskForm.value)
    showAddTask.value = false
    $q.notify({ type: 'positive', message: 'Tarefa criada!' })
    emit('refresh')
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao criar tarefa' })
  } finally {
    saving.value = false
  }
}

async function deleteTask(task) {
  $q.dialog({
    title: 'Excluir Tarefa',
    message: `Excluir a tarefa "${task.name}"?`,
    cancel: true,
    ok: { label: 'Excluir', color: 'negative' }
  }).onOk(async () => {
    try {
      await orderStore.deleteTask(task.id)
      $q.notify({ type: 'positive', message: 'Tarefa excluída!' })
      emit('refresh')
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir tarefa' })
    }
  })
}
</script>
