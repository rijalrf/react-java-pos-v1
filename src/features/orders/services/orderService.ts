import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetailResponse,
  OrderListResponse,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from '../types/order'

import { apiClient } from '@/services/apiClient'

export type OrderQuery = {
  customerName?: string
  status?: string
  page?: number
  size?: number
  sort?: string
}

export const orderService = {
  async getOrders(query?: OrderQuery) {
    return apiClient<OrderListResponse>('/orders', { query })
  },
  async getOrderById(id: number) {
    return apiClient<OrderDetailResponse>(`/orders/${id}`)
  },
  async createOrder(payload: CreateOrderPayload) {
    return apiClient<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: payload,
    })
  },
  async updateOrderStatus(id: number, payload: UpdateOrderStatusPayload) {
    return apiClient<UpdateOrderStatusResponse>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: payload,
    })
  },
  async deleteOrder(id: number) {
    await apiClient<void>(`/orders/${id}`, {
      method: 'DELETE',
    })
  },
}

