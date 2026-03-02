import { api } from '../boot/axios'

export const getStages = (orderId) => api.get(`/service-orders/${orderId}/stages`)
export const createStage = (orderId, data) => api.post(`/service-orders/${orderId}/stages`, data)
export const updateStage = (id, data) => api.put(`/stages/${id}`, data)
export const deleteStage = (id) => api.delete(`/stages/${id}`)
