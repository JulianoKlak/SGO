import { useAuthStore } from '../stores/auth.store'

export default async ({ router }) => {
  const authStore = useAuthStore()
  authStore.initFromStorage()

  router.beforeEach((to, from, next) => {
    const userType = Number(authStore.user?.type)
    const requiresAuth = to.meta?.requiresAuth !== false
    const requiredRoles = to.meta?.roles

    if (requiresAuth && !authStore.isAuthenticated) {
      return next('/login')
    }

    if (requiredRoles && !requiredRoles.includes(userType)) {
      if (userType === 2) return next(to.path === '/mechanic' ? true : '/mechanic')
      if (userType === 0 || userType === 1) return next(to.path === '/dashboard' ? true : '/dashboard')
      authStore.logout()
      return next('/login')
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
      if (userType === 2) return next('/mechanic')
      return next('/dashboard')
    }

    next()
  })
}
