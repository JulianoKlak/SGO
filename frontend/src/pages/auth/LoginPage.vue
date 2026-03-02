<template>
  <div class="q-pa-md" style="max-width: 380px; margin: 0 auto;">
    <q-form @submit="handleLogin" class="q-gutter-md">
      <q-input
        v-model="form.username"
        label="Usuário"
        outlined
        dense
        :rules="[v => !!v || 'Usuário obrigatório']"
        prepend-icon="person"
      >
        <template #prepend>
          <q-icon name="person" color="primary" />
        </template>
      </q-input>

      <q-input
        v-model="form.password"
        label="Senha"
        outlined
        dense
        :type="showPassword ? 'text' : 'password'"
        :rules="[v => !!v || 'Senha obrigatória']"
      >
        <template #prepend>
          <q-icon name="lock" color="primary" />
        </template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-banner v-if="error" class="bg-red-1 text-red-9 rounded-borders" dense>
        <template #avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
      </q-banner>

      <q-btn
        type="submit"
        label="Entrar"
        color="primary"
        class="full-width"
        size="lg"
        :loading="loading"
        unelevated
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../../stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({ username: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
    $q.notify({ type: 'positive', message: 'Login realizado com sucesso!' })
    if (authStore.user?.type === 2) {
      router.push('/mechanic')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Credenciais inválidas. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
