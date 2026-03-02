import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as clientService from '../services/client.service'

export const useClientStore = defineStore('client', () => {
  const clients = ref([])
  const loading = ref(false)
  const total = ref(0)

  async function fetchClients(params = {}) {
    loading.value = true
    try {
      const response = await clientService.getClients(params)
      clients.value = response.data.data || response.data
      total.value = response.data.total || clients.value.length
      return response.data
    } finally {
      loading.value = false
    }
  }

  async function fetchClient(id) {
    const response = await clientService.getClient(id)
    return response.data
  }

  async function createClient(data) {
    const response = await clientService.createClient(data)
    await fetchClients()
    return response.data
  }

  async function updateClient(id, data) {
    const response = await clientService.updateClient(id, data)
    await fetchClients()
    return response.data
  }

  async function deleteClient(id) {
    await clientService.deleteClient(id)
    clients.value = clients.value.filter(c => c.id !== id)
    total.value--
  }

  return { clients, loading, total, fetchClients, fetchClient, createClient, updateClient, deleteClient }
})
