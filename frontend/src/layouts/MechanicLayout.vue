<template>
  <q-layout view="lHh Lpr lFf" class="mechanic-layout">
    <q-header elevated class="mechanic-header">
      <q-toolbar>
        <q-icon name="build" size="22px" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold">SGO</q-toolbar-title>
        <q-avatar color="white" text-color="primary" size="30px" class="q-mr-xs">
          {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
        </q-avatar>
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
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
    persistent: true,
  }).onOk(() => {
    authStore.logout()
    router.push('/login')
  })
}
</script>
