import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../boot/axios'

export const useMechanicStore = defineStore('mechanic', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)

  async function fetchOrders() {
    loading.value = true
    try {
      const response = await api.get('/mechanic/orders')
      orders.value = response.data?.data || []
      return orders.value
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(orderId) {
    loading.value = true
    try {
      const response = await api.get(`/service-orders/${orderId}`)
      currentOrder.value = response.data?.data || response.data
      return currentOrder.value
    } finally {
      loading.value = false
    }
  }

  async function startOrder(orderId) {
    await api.patch(`/mechanic/orders/${orderId}/start`)
    return fetchOrder(orderId)
  }

  async function blockOrder(orderId) {
    await api.patch(`/mechanic/orders/${orderId}/block`)
    return fetchOrder(orderId)
  }

  async function completeTask(taskId, orderId) {
    await api.put(`/mechanic/tasks/${taskId}/complete`)
    if (orderId) {
      return fetchOrder(orderId)
    }
  }

  async function updateTaskStatus(taskId, status, orderId) {
    await api.patch(`/tasks/${taskId}/status`, { status })
    if (orderId) {
      return fetchOrder(orderId)
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    fetchOrders,
    fetchOrder,
    startOrder,
    blockOrder,
    completeTask,
    updateTaskStatus,
  }
})
