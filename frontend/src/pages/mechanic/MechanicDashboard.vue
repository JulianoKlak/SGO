<template>
  <div>
    <div class="text-h5 text-weight-bold q-mb-lg">Minhas Tarefas</div>

    <q-inner-loading :showing="mechanicStore.loading" />

    <KanbanBoard
      :orders="mechanicStore.orders"
      @task-complete="handleTaskComplete"
      @refresh="mechanicStore.fetchOrders()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMechanicStore } from '../../stores/mechanic.store'
import KanbanBoard from '../../components/mechanic/KanbanBoard.vue'

const $q = useQuasar()
const mechanicStore = useMechanicStore()

async function handleTaskComplete(taskId) {
  try {
    await mechanicStore.completeTask(taskId)
    $q.notify({ type: 'positive', message: 'Tarefa concluída!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao concluir tarefa' })
  }
}

onMounted(() => mechanicStore.fetchOrders())
</script>
