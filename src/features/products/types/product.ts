import type { Pagination } from '@/types/pagination'

export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

export type ProductListResponse = {
  code: number
  success: boolean
  message: string
  data: {
    products: Product[]
    pagination: Pagination
  }
}

export type { Pagination } from '@/types/pagination'

export type ProductItemResponse = {
  code: number
  success: boolean
  message: string
  data: {
    product: Product
  }
}

export type ApiErrorResponse = {
  code: number
  success: false
  message: string
  errors: Record<string, string> | null
}

export type CreateProductPayload = {
  name: string
  price: number
  stock: number
}

export type UpdateProductPayload = CreateProductPayload
