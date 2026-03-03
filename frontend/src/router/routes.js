import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'
import MechanicLayout from '../layouts/MechanicLayout.vue'

export default [
  {
    path: '/login',
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [{ path: '', component: () => import('../pages/auth/LoginPage.vue') }]
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true, roles: [0, 1] },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('../pages/dashboard/DashboardPage.vue') },
      { path: 'clients', component: () => import('../pages/clients/ClientListPage.vue') },
      { path: 'clients/new', component: () => import('../pages/clients/ClientFormPage.vue') },
      { path: 'clients/:id/edit', component: () => import('../pages/clients/ClientFormPage.vue') },
      { path: 'vehicles', component: () => import('../pages/vehicles/VehicleListPage.vue') },
      { path: 'vehicles/new', component: () => import('../pages/vehicles/VehicleFormPage.vue') },
      { path: 'vehicles/:id/edit', component: () => import('../pages/vehicles/VehicleFormPage.vue') },
      { path: 'products', component: () => import('../pages/products/ProductListPage.vue') },
      { path: 'products/new', component: () => import('../pages/products/ProductFormPage.vue') },
      { path: 'products/:id/edit', component: () => import('../pages/products/ProductFormPage.vue') },
      { path: 'services', component: () => import('../pages/services/ServiceListPage.vue') },
      { path: 'services/new', component: () => import('../pages/services/ServiceFormPage.vue') },
      { path: 'services/:id/edit', component: () => import('../pages/services/ServiceFormPage.vue') },
      { path: 'service-orders', component: () => import('../pages/serviceOrders/ServiceOrderListPage.vue') },
      { path: 'service-orders/new', component: () => import('../pages/serviceOrders/ServiceOrderFormPage.vue') },
      { path: 'service-orders/:id', component: () => import('../pages/serviceOrders/ServiceOrderDetailPage.vue') },
      { path: 'service-orders/:id/edit', component: () => import('../pages/serviceOrders/ServiceOrderFormPage.vue') },
      { path: 'users', component: () => import('../pages/users/UserListPage.vue'), meta: { requiresAuth: true, roles: [1] } },
      { path: 'users/new', component: () => import('../pages/users/UserFormPage.vue'), meta: { requiresAuth: true, roles: [1] } },
      { path: 'users/:id/edit', component: () => import('../pages/users/UserFormPage.vue'), meta: { requiresAuth: true, roles: [1] } }
    ]
  },
  {
    path: '/mechanic',
    component: MechanicLayout,
    meta: { requiresAuth: true, roles: [2] },
    children: [
      { path: '', component: () => import('../pages/mechanic/MechanicDashboard.vue') },
      { path: 'orders/:id', component: () => import('../pages/mechanic/MechanicOrderDetailPage.vue') }
    ]
  },
  { path: '/:catchAll(.*)*', redirect: '/login' }
]
