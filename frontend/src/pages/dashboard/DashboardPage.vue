<template>
  <div>
    <div class="text-h5 text-weight-bold q-mb-lg">Dashboard</div>

    <!-- Metric Cards -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="metric in metrics" :key="metric.key">
        <q-card :class="`metric-card bg-${metric.color} text-white`">
          <q-card-section class="relative-position">
            <div class="row items-center">
              <div class="col">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value q-mt-sm">
                  <template v-if="loading">
                    <q-skeleton type="text" width="80px" dark />
                  </template>
                  <template v-else>{{ metric.value }}</template>
                </div>
              </div>
              <q-icon :name="metric.icon" class="metric-icon" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts + Mechanics -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-7">
        <q-card class="erp-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">OS por Status</div>
            <PerformanceChart v-if="chartData" :chart-data="chartData" />
            <q-skeleton v-else height="250px" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="erp-card full-height">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Mecânicos</div>
            <MechanicMetrics :mechanics="mechanicsData" :loading="loading" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Orders -->
    <q-card class="erp-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">Ordens Recentes</div>
        <OrderProgress :orders="recentOrders" :loading="loading" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import * as dashboardService from '../../services/dashboard.service'
import PerformanceChart from '../../components/dashboard/PerformanceChart.vue'
import MechanicMetrics from '../../components/dashboard/MechanicMetrics.vue'
import OrderProgress from '../../components/dashboard/OrderProgress.vue'

const $q = useQuasar()
const loading = ref(true)
const metricsData = ref({})
const mechanicsData = ref([])
const recentOrders = ref([])
const chartData = ref(null)

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const metrics = computed(() => [
  { key: 'total', label: 'Total OS', value: metricsData.value.totalOrders || 0, icon: 'assignment', color: 'blue-7' },
  { key: 'progress', label: 'Em Andamento', value: metricsData.value.inProgressOrders || 0, icon: 'autorenew', color: 'orange-7' },
  { key: 'clients', label: 'Clientes', value: metricsData.value.totalClients || 0, icon: 'people', color: 'green-7' },
  { key: 'revenue', label: 'Receita Total', value: formatCurrency(metricsData.value.totalRevenue), icon: 'attach_money', color: 'purple-7' }
])

onMounted(async () => {
  try {
    const [metricsRes, mechanicsRes, progressRes] = await Promise.all([
      dashboardService.getMetrics(),
      dashboardService.getMechanics(),
      dashboardService.getOrdersProgress()
    ])
    metricsData.value = metricsRes.data
    mechanicsData.value = mechanicsRes.data
    recentOrders.value = progressRes.data

    chartData.value = {
      labels: ['Abertas', 'Em Andamento', 'Concluídas', 'Canceladas'],
      datasets: [{
        label: 'Ordens de Serviço',
        data: [
          metricsData.value.openOrders || 0,
          metricsData.value.inProgressOrders || 0,
          metricsData.value.completedOrders || 0,
          metricsData.value.cancelledOrders || 0
        ],
        backgroundColor: ['#1565C0', '#E65100', '#2E7D32', '#C62828']
      }]
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados do dashboard' })
  } finally {
    loading.value = false
  }
})
</script>
