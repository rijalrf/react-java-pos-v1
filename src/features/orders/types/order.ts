import type { Pagination } from '@/types/pagination'

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELED'

export type OrderProduct = {
  id: number
  name: string
  price: number
  stock: number
}

export type OrderItem = {
  product: OrderProduct
  quantity: number
  price: number
}

export type Order = {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  orderDate: string
  totalAmount: number
  orderStatus: OrderStatus
  items: OrderItem[]
}

export type OrderListResponse = {
  code: number
  success: boolean
  message: string
  data: {
    orders: Order[]
    pagination: Pagination
  }
}

export type OrderDetailResponse = {
  code: number
  success: boolean
  message: string
  data: {
    order: Order
  }
}

export type CreateOrderPayload = {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
}

export type UpdateOrderStatusPayload = {
  orderStatus: OrderStatus
}

export type CreateOrderResponse = {
  code: number
  success: boolean
  message: string
  data: {
    order: Omit<Order, 'items'>
    items: OrderItem[]
  }
}

export type UpdateOrderStatusResponse = {
  code: number
  success: boolean
  message: string
  data: {
    order: Omit<Order, 'items'>
  }
}
