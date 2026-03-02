import { api } from '../boot/axios'

export const getMetrics = () => api.get('/dashboard/metrics')
export const getMechanics = () => api.get('/dashboard/mechanics')
export const getOrdersProgress = () => api.get('/dashboard/orders-progress')
