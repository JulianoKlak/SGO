<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            class="col-12 col-md-5"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
          <q-input
            v-model="form.username"
            label="Usuário (login) *"
            outlined
            class="col-12 col-md-3"
            :rules="[v => !!v || 'Usuário é obrigatório']"
          />
          <q-select
            v-model="form.type"
            :options="typeOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Tipo *"
            outlined
            class="col-12 col-md-2"
          />
        </div>

        <div class="row q-gutter-md">
          <q-input v-model="form.email" label="E-mail" outlined class="col-12 col-md-4" type="email" />
          <q-input v-model="form.phone" label="Telefone" outlined class="col-12 col-md-3" mask="(##) #####-####" />
          <div class="col-12 col-md-2 flex items-center">
            <q-toggle v-model="form.status" :label="form.status ? 'Ativo' : 'Inativo'" color="positive" />
          </div>
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.password"
            :label="isEdit ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha *'"
            outlined
            class="col-12 col-md-5"
            :type="showPassword ? 'text' : 'password'"
            :rules="isEdit ? [] : [v => !!v || 'Senha é obrigatória']"
          >
            <template #append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>
        </div>

        <div class="row q-gutter-sm justify-end q-pt-sm">
          <q-btn flat label="Cancelar" @click="$router.back()" />
          <q-btn type="submit" color="primary" :label="isEdit ? 'Salvar' : 'Criar'" unelevated :loading="loading" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../../boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const showPassword = ref(false)

const typeOptions = [
  { value: 0, label: 'Usuário' },
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Mecânico' }
]

const form = ref({
  name: '', username: '', password: '', email: '', phone: '', type: 0, status: true
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const response = await api.get(`/users/${route.params.id}`)
      const user = response.data?.data || response.data
      form.value.name = user.name
      form.value.username = user.username
      form.value.email = user.email || ''
      form.value.phone = user.phone || ''
      form.value.type = Number(user.type ?? 0)
      form.value.status = Number(user.status ?? 1) === 1
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar usuário' })
      router.push('/users')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    const data = { ...form.value }
    data.type = Number(data.type)
    data.status = data.status ? 1 : 0
    if (isEdit.value && !data.password) delete data.password

    if (isEdit.value) {
      await api.put(`/users/${route.params.id}`, data)
      $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso!' })
    } else {
      await api.post('/users', data)
      $q.notify({ type: 'positive', message: 'Usuário criado com sucesso!' })
    }
    router.push('/users')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar usuário' })
  } finally {
    loading.value = false
  }
}
</script>
