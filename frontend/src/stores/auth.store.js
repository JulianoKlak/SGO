import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.type === 1)
  const isUser = computed(() => user.value?.type === 0)
  const isMechanic = computed(() => user.value?.type === 2)

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('sgo_token', token.value)
    localStorage.setItem('sgo_user', JSON.stringify(user.value))
    return response.data
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('sgo_token')
    localStorage.removeItem('sgo_user')
  }

  function initFromStorage() {
    const storedToken = localStorage.getItem('sgo_token')
    const storedUser = localStorage.getItem('sgo_user')
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        logout()
      }
    }
  }

  async function updateProfile(data) {
    const response = await api.put('/auth/profile', data)
    user.value = response.data
    localStorage.setItem('sgo_user', JSON.stringify(user.value))
    return response.data
  }

  return { token, user, isAuthenticated, isAdmin, isUser, isMechanic, login, logout, initFromStorage, updateProfile }
})
