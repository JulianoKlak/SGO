import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as serviceService from '../services/service.service'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])
  const loading = ref(false)
  const total = ref(0)

  async function fetchServices(params = {}) {
    loading.value = true
    try {
      const response = await serviceService.getServices(params)
      const payload = response.data?.data || {}
      services.value = Array.isArray(payload.data) ? payload.data : []
      total.value = payload.total ?? services.value.length
      return payload
    } finally {
      loading.value = false
    }
  }

  async function fetchService(id) {
    const response = await serviceService.getService(id)
    return response.data?.data || response.data
  }

  async function createService(data) {
    const response = await serviceService.createService(data)
    await fetchServices()
    return response.data?.data || response.data
  }

  async function updateService(id, data) {
    const response = await serviceService.updateService(id, data)
    await fetchServices()
    return response.data?.data || response.data
  }

  async function deleteService(id) {
    await serviceService.deleteService(id)
    services.value = services.value.filter(s => s.id !== id)
    total.value--
  }

  return { services, loading, total, fetchServices, fetchService, createService, updateService, deleteService }
})
