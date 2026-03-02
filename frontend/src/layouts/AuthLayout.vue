<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="auth-card q-pa-lg">
          <q-card-section class="text-center q-pb-sm">
            <div class="auth-logo">SGO</div>
            <div class="auth-subtitle q-mt-sm">Sistema de Gerenciamento de Oficinas</div>
          </q-card-section>
          <q-card-section>
            <router-view />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>
