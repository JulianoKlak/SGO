import { useAuthStore } from '../stores/auth.store'

export default async ({ router }) => {
  const authStore = useAuthStore()
  authStore.initFromStorage()

  router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth !== false
    const requiredRoles = to.meta?.roles

    if (requiresAuth && !authStore.isAuthenticated) {
      return next('/login')
    }

    if (requiredRoles && !requiredRoles.includes(authStore.user?.type)) {
      if (authStore.user?.type === 2) return next('/mechanic')
      return next('/dashboard')
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
      if (authStore.user?.type === 2) return next('/mechanic')
      return next('/dashboard')
    }

    next()
  })
}
