<template>
  <div class="mechanic-mobile">
    <div class="row items-center q-mb-sm">
      <q-btn flat round dense icon="arrow_back" @click="router.push('/mechanic')" />
      <div class="text-h6 text-weight-bold q-ml-sm">OS #{{ route.params.id }}</div>
    </div>

    <q-inner-loading :showing="mechanicStore.loading" />

    <q-card v-if="order" flat bordered class="q-mb-md">
      <q-card-section class="q-pb-sm">
        <div class="text-h6 text-weight-bold">{{ order.vehicle?.plate || 'Sem placa' }}</div>
        <div class="text-body1">{{ order.vehicle?.brand || '-' }} {{ order.vehicle?.model || '' }}</div>
      </q-card-section>
      <q-card-actions class="q-pt-none">
        <q-btn
          class="full-width q-mb-sm"
          color="positive"
          unelevated
          :label="order.status === 'in_progress' ? 'SERVIÇO EM ANDAMENTO' : 'INICIAR SERVIÇO'"
          :disable="order.status === 'in_progress' || isClosed"
          @click="startOrder"
        />
      </q-card-actions>
    </q-card>

    <q-card v-if="order?.status === 'completed'" flat bordered class="q-mb-md text-center q-pa-md">
      <q-icon name="check_circle" size="56px" color="positive" />
      <div class="text-h6 text-weight-bold q-mt-sm">Serviço Finalizado com Sucesso</div>
      <q-btn color="primary" class="q-mt-md" unelevated label="Voltar para Minhas OS" @click="router.push('/mechanic')" />
    </q-card>

    <div v-for="stage in stages" :key="stage.id" class="q-mb-md">
      <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ stage.name }}</div>
      <q-card flat bordered>
        <q-list separator>
          <q-item v-for="task in stage.tasks" :key="task.id" dense>
            <q-item-section avatar>
              <q-checkbox
                :model-value="task.status === 'completed'"
                :disable="task.status === 'completed' || isBlocked || isClosed"
                @update:model-value="(checked) => onTaskToggle(task, checked)"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="{ 'text-grey-5 text-strike': task.status === 'completed' }">
                {{ task.description || 'Sem descrição' }}
              </q-item-label>
              <q-item-label caption v-if="task.status === 'blocked'" class="text-red-7">
                Bloqueada
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="q-pb-xs">
        <div class="text-subtitle2 text-weight-bold">Progresso geral</div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="row items-center justify-between q-mb-xs">
          <span class="text-caption">{{ completedTasks }} de {{ totalTasks }} etapas concluídas</span>
          <span class="text-weight-bold">{{ progress }}%</span>
        </div>
        <q-linear-progress rounded size="10px" :value="progress / 100" color="positive" track-color="grey-4" />
      </q-card-section>
    </q-card>

    <q-btn
      color="deep-orange-7"
      class="full-width q-mb-sm"
      unelevated
      label="BLOQUEAR TAREFA"
      :disable="isClosed"
      @click="blockOrder"
    />
    <q-btn flat class="full-width" label="Cancelar" @click="router.push('/mechanic')" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMechanicStore } from '../../stores/mechanic.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const mechanicStore = useMechanicStore()

const order = computed(() => mechanicStore.currentOrder)
const stages = computed(() => order.value?.stages || [])

const tasks = computed(() =>
  stages.value.flatMap((stage) => stage.tasks || []),
)

const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter((task) => task.status === 'completed').length)
const progress = computed(() => totalTasks.value ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0)
const isBlocked = computed(() => tasks.value.some((task) => task.status === 'blocked'))
const isClosed = computed(() => ['completed', 'paid', 'cancelled'].includes(order.value?.status))

async function refreshOrder() {
  await mechanicStore.fetchOrder(route.params.id)
}

async function startOrder() {
  try {
    await mechanicStore.startOrder(route.params.id)
    $q.notify({ type: 'positive', message: 'Serviço iniciado' })
    await mechanicStore.fetchOrders()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao iniciar serviço' })
  }
}

async function blockOrder() {
  try {
    await mechanicStore.blockOrder(route.params.id)
    $q.notify({ type: 'warning', message: 'Tarefas bloqueadas' })
    await mechanicStore.fetchOrders()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao bloquear serviço' })
  }
}

async function onTaskToggle(task, checked) {
  if (!checked) {
    $q.notify({ type: 'info', message: 'Desmarcar precisa autorização de usuário/admin' })
    return
  }

  try {
    await mechanicStore.completeTask(task.id, route.params.id)
    $q.notify({ type: 'positive', message: 'Etapa concluída' })
    await mechanicStore.fetchOrders()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao concluir etapa' })
    await refreshOrder()
  }
}

onMounted(refreshOrder)
</script>
