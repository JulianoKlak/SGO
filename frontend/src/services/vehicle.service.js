import { api } from '../boot/axios'

export const getVehicles = (params) => api.get('/vehicles', { params })
export const getVehicle = (id) => api.get(`/vehicles/${id}`)
export const getClientVehicles = (clientId) => api.get('/vehicles', { params: { client_id: clientId } })
export const createVehicle = (data) => api.post('/vehicles', data)
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data)
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`)
