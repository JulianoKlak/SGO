<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="erp-header" elevated>
      <q-toolbar>
        <q-icon name="build" size="28px" class="q-mr-sm text-white" />
        <q-toolbar-title class="text-white text-weight-bold">SGO — Painel do Mecânico</q-toolbar-title>
        <q-space />
        <div class="row items-center q-gutter-sm">
          <div class="column items-end gt-xs">
            <span class="text-white text-weight-medium text-body2">{{ authStore.user?.name }}</span>
            <q-badge color="green-6" class="q-mt-xs text-caption">Mecânico</q-badge>
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

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

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
