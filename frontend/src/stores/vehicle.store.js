import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as vehicleService from '../services/vehicle.service'

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref([])
  const loading = ref(false)
  const total = ref(0)

  async function fetchVehicles(params = {}) {
    loading.value = true
    try {
      const response = await vehicleService.getVehicles(params)
      const payload = response.data?.data || []
      vehicles.value = Array.isArray(payload) ? payload : []
      total.value = vehicles.value.length
      return payload
    } finally {
      loading.value = false
    }
  }

  async function fetchVehicle(id) {
    const response = await vehicleService.getVehicle(id)
    return response.data?.data || response.data
  }

  async function fetchClientVehicles(clientId) {
    const response = await vehicleService.getClientVehicles(clientId)
    return response.data?.data || response.data
  }

  async function createVehicle(data) {
    const response = await vehicleService.createVehicle(data)
    await fetchVehicles()
    return response.data?.data || response.data
  }

  async function updateVehicle(id, data) {
    const response = await vehicleService.updateVehicle(id, data)
    await fetchVehicles()
    return response.data?.data || response.data
  }

  async function deleteVehicle(id) {
    await vehicleService.deleteVehicle(id)
    vehicles.value = vehicles.value.filter(v => v.id !== id)
    total.value--
  }

  return { vehicles, loading, total, fetchVehicles, fetchVehicle, fetchClientVehicles, createVehicle, updateVehicle, deleteVehicle }
})
