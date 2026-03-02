import { api } from '../boot/axios'

export const getOrders = (params) => api.get('/service-orders', { params })
export const getOrder = (id) => api.get(`/service-orders/${id}`)
export const createOrder = (data) => api.post('/service-orders', data)
export const updateOrder = (id, data) => api.put(`/service-orders/${id}`, data)
export const updateOrderStatus = (id, status) => api.patch(`/service-orders/${id}/status`, { status })
export const deleteOrder = (id) => api.delete(`/service-orders/${id}`)

export const addProduct = (orderId, data) => api.post(`/service-orders/${orderId}/products`, data)
export const removeProduct = (orderId, productId) => api.delete(`/service-orders/${orderId}/products/${productId}`)

export const addService = (orderId, data) => api.post(`/service-orders/${orderId}/services`, data)
export const removeService = (orderId, serviceId) => api.delete(`/service-orders/${orderId}/services/${serviceId}`)
