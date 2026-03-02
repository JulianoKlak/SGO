import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as taskService from '../services/task.service'
import { api } from '../boot/axios'

export const useMechanicStore = defineStore('mechanic', () => {
  const orders = ref([])
  const loading = ref(false)

  async function fetchOrders() {
    loading.value = true
    try {
      const response = await api.get('/mechanic/tasks')
      orders.value = response.data.data || response.data
      return orders.value
    } finally {
      loading.value = false
    }
  }

  async function completeTask(id) {
    const response = await taskService.updateTaskStatus(id, 'completed')
    await fetchOrders()
    return response.data
  }

  async function fetchTaskDetails(id) {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  }

  return { orders, loading, fetchOrders, completeTask, fetchTaskDetails }
})
