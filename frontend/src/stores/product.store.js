import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as productService from '../services/product.service'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const total = ref(0)

  async function fetchProducts(params = {}) {
    loading.value = true
    try {
      const response = await productService.getProducts(params)
      products.value = response.data.data || response.data
      total.value = response.data.total || products.value.length
      return response.data
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    const response = await productService.getProduct(id)
    return response.data
  }

  async function createProduct(data) {
    const response = await productService.createProduct(data)
    await fetchProducts()
    return response.data
  }

  async function updateProduct(id, data) {
    const response = await productService.updateProduct(id, data)
    await fetchProducts()
    return response.data
  }

  async function deleteProduct(id) {
    await productService.deleteProduct(id)
    products.value = products.value.filter(p => p.id !== id)
    total.value--
  }

  return { products, loading, total, fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct }
})
