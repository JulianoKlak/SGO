import { api } from '../boot/axios'

export const getTasks = (stageId) => api.get(`/stages/${stageId}/tasks`)
export const createTask = (stageId, data) => api.post(`/stages/${stageId}/tasks`, data)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status })
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

export const getComments = (taskId) => api.get(`/tasks/${taskId}/comments`)
export const addComment = (taskId, text) => api.post(`/tasks/${taskId}/comments`, { text })

export const getImages = (taskId) => api.get(`/tasks/${taskId}/images`)
export const uploadImage = (taskId, formData) => api.post(`/tasks/${taskId}/images`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
