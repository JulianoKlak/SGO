import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as orderService from '../services/serviceOrder.service'
import * as stageService from '../services/stage.service'
import * as taskService from '../services/task.service'

export const useServiceOrderStore = defineStore('serviceOrder', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const total = ref(0)

  async function fetchOrders(params = {}) {
    loading.value = true
    try {
      const response = await orderService.getOrders(params)
      const payload = response.data?.data || {}
      orders.value = Array.isArray(payload.data) ? payload.data : []
      total.value = payload.total ?? orders.value.length
      return payload
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(id) {
    loading.value = true
    try {
      const response = await orderService.getOrder(id)
      currentOrder.value = response.data?.data || response.data
      return currentOrder.value
    } finally {
      loading.value = false
    }
  }

  async function createOrder(data) {
    const response = await orderService.createOrder(data)
    return response.data?.data || response.data
  }

  async function updateOrder(id, data) {
    const response = await orderService.updateOrder(id, data)
    const payload = response.data?.data || response.data
    if (currentOrder.value?.id === id) {
      currentOrder.value = { ...currentOrder.value, ...payload }
    }
    return payload
  }

  async function updateOrderStatus(id, status) {
    const response = await orderService.updateOrderStatus(id, status)
    const payload = response.data?.data || response.data
    if (currentOrder.value?.id === id) {
      currentOrder.value = { ...currentOrder.value, status }
    }
    return payload
  }

  async function deleteOrder(id) {
    await orderService.deleteOrder(id)
    orders.value = orders.value.filter(o => o.id !== id)
    total.value--
  }

  async function addProduct(orderId, data) {
    const response = await orderService.addProduct(orderId, data)
    await fetchOrder(orderId)
    return response.data?.data || response.data
  }

  async function removeProduct(orderId, productId) {
    await orderService.removeProduct(orderId, productId)
    await fetchOrder(orderId)
  }

  async function addService(orderId, data) {
    const response = await orderService.addService(orderId, data)
    await fetchOrder(orderId)
    return response.data?.data || response.data
  }

  async function removeService(orderId, serviceId) {
    await orderService.removeService(orderId, serviceId)
    await fetchOrder(orderId)
  }

  // Stages
  async function fetchStages(orderId) {
    const response = await stageService.getStages(orderId)
    return response.data?.data || response.data
  }

  async function createStage(orderId, data) {
    const response = await stageService.createStage(orderId, data)
    await fetchOrder(orderId)
    return response.data?.data || response.data
  }

  async function updateStage(id, data) {
    const response = await stageService.updateStage(id, data)
    return response.data?.data || response.data
  }

  async function deleteStage(orderId, id) {
    await stageService.deleteStage(id)
    await fetchOrder(orderId)
  }

  // Tasks
  async function createTask(stageId, data) {
    const response = await taskService.createTask(stageId, data)
    return response.data?.data || response.data
  }

  async function updateTask(id, data) {
    const response = await taskService.updateTask(id, data)
    return response.data?.data || response.data
  }

  async function updateTaskStatus(id, status) {
    const response = await taskService.updateTaskStatus(id, status)
    return response.data?.data || response.data
  }

  async function deleteTask(id) {
    await taskService.deleteTask(id)
  }

  return {
    orders, currentOrder, loading, total,
    fetchOrders, fetchOrder, createOrder, updateOrder, updateOrderStatus, deleteOrder,
    addProduct, removeProduct, addService, removeService,
    fetchStages, createStage, updateStage, deleteStage,
    createTask, updateTask, updateTaskStatus, deleteTask
  }
})
