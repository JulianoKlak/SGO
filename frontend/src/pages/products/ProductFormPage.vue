<template>
  <div class="erp-form">
    <div class="row items-center q-mb-lg">
      <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mr-sm" />
      <div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar Produto' : 'Novo Produto' }}</div>
    </div>

    <q-card class="q-pa-md">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            class="col-12 col-md-6"
            :rules="[v => !!v || 'Nome é obrigatório']"
          />
          <q-input
            v-model.number="form.price"
            label="Preço"
            outlined
            class="col-12 col-md-3"
            type="number"
            step="0.01"
            prefix="R$"
          />
          <div class="col-12 col-md-2 flex items-center">
            <q-toggle v-model="form.status" :label="form.status ? 'Ativo' : 'Inativo'" color="positive" />
          </div>
        </div>

        <div class="row q-gutter-md">
          <q-input
            v-model="form.description"
            label="Descrição"
            outlined
            class="col-12"
            type="textarea"
            rows="3"
          />
        </div>

        <div class="row q-gutter-md">
          <div class="col-12 col-md-4">
            <div class="text-subtitle2 q-mb-sm">Imagem do Produto</div>
            <q-file
              v-model="imageFile"
              label="Selecionar imagem"
              outlined
              accept="image/*"
              dense
            >
              <template #prepend><q-icon name="image" /></template>
            </q-file>
            <q-img
              v-if="imagePreview"
              :src="imagePreview"
              class="q-mt-sm border-radius-md"
              style="max-height: 150px; width: auto;"
            />
          </div>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useProductStore } from '../../stores/product.store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)

const form = ref({ name: '', description: '', price: 0, status: true })

watch(imageFile, (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => { imagePreview.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    imagePreview.value = null
  }
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const product = await productStore.fetchProduct(route.params.id)
      Object.assign(form.value, product)
      if (product.image_url) imagePreview.value = product.image_url
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao carregar produto' })
      router.push('/products')
    }
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await productStore.updateProduct(route.params.id, form.value)
      $q.notify({ type: 'positive', message: 'Produto atualizado com sucesso!' })
    } else {
      await productStore.createProduct(form.value)
      $q.notify({ type: 'positive', message: 'Produto criado com sucesso!' })
    }
    router.push('/products')
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Erro ao salvar produto' })
  } finally {
    loading.value = false
  }
}
</script>
