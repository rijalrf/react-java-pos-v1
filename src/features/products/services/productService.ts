import type {
  CreateProductPayload,
  ProductItemResponse,
  ProductListResponse,
  UpdateProductPayload,
} from '../types/product'

import { apiClient } from '@/services/apiClient'

export type ProdukQuery = {
  name?: string
  page?: number
  size?: number
  sort?: string
}

export const productService = {
  async getProducts(query?: ProdukQuery) {
    return apiClient<ProductListResponse>('/products', { query })
  },
  async getProductById(id: number) {
    return apiClient<ProductItemResponse>(`/products/${id}`)
  },
  async createProduct(payload: CreateProductPayload) {
    return apiClient<ProductItemResponse>('/products', {
      method: 'POST',
      body: payload,
    })
  },
  async updateProduct(id: number, payload: UpdateProductPayload) {
    return apiClient<ProductItemResponse>(`/products/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  async deleteProduct(id: number) {
    await apiClient<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  },
}
