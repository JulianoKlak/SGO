<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="erp-header" elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleDrawer" class="text-white" />
        <q-toolbar-title class="erp-logo">SGO</q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm">
          <div class="column items-end gt-xs">
            <span class="text-white text-weight-medium text-body2">{{ authStore.user?.name }}</span>
            <q-badge :color="roleColor" class="q-mt-xs text-caption">{{ roleLabel }}</q-badge>
          </div>
          <q-avatar color="white" text-color="primary" size="36px">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
          </q-avatar>
          <q-btn flat round dense icon="logout" class="text-white" @click="handleLogout">
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="drawerOpen"
      :mini="miniDrawer && $q.screen.gt.sm"
      :breakpoint="768"
      class="erp-sidebar"
      :width="240"
      :mini-width="60"
      show-if-above
    >
      <!-- Logo area when mini -->
      <q-toolbar class="erp-header" style="min-height: 50px;">
        <q-toolbar-title v-if="!miniDrawer" class="text-white text-weight-bold text-h6">Menu</q-toolbar-title>
        <q-btn
          v-if="$q.screen.gt.sm"
          flat
          round
          dense
          :icon="miniDrawer ? 'chevron_right' : 'chevron_left'"
          class="text-white"
          @click="miniDrawer = !miniDrawer"
        />
      </q-toolbar>

      <q-scroll-area style="height: calc(100% - 50px);">
        <q-list padding>
          <q-item
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            active-class="q-item--active"
            clickable
            v-ripple
            class="rounded-borders"
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
            <q-tooltip v-if="miniDrawer" anchor="center right" self="center left">{{ item.label }}</q-tooltip>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main content -->
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const drawerOpen = ref(true)
const miniDrawer = ref(false)

function toggleDrawer() {
  if ($q.screen.gt.sm) {
    miniDrawer.value = !miniDrawer.value
  } else {
    drawerOpen.value = !drawerOpen.value
  }
}

const roleLabel = computed(() => {
  const types = { 0: 'Usuário', 1: 'Admin', 2: 'Mecânico' }
  return types[authStore.user?.type] || 'Usuário'
})

const roleColor = computed(() => {
  const colors = { 0: 'blue-6', 1: 'deep-orange-6', 2: 'green-6' }
  return colors[authStore.user?.type] || 'blue-6'
})

const allNavItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: [0, 1] },
  { to: '/clients', icon: 'people', label: 'Clientes', roles: [0, 1] },
  { to: '/vehicles', icon: 'directions_car', label: 'Veículos', roles: [0, 1] },
  { to: '/products', icon: 'inventory_2', label: 'Produtos', roles: [0, 1] },
  { to: '/services', icon: 'build', label: 'Serviços', roles: [0, 1] },
  { to: '/service-orders', icon: 'assignment', label: 'Ordens de Serviço', roles: [0, 1] },
  { to: '/users', icon: 'manage_accounts', label: 'Usuários', roles: [1] }
]

const navItems = computed(() =>
  allNavItems.filter(item => item.roles.includes(authStore.user?.type))
)

function handleLogout() {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja realmente sair do sistema?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    authStore.logout()
    router.push('/login')
  })
}
</script>
