import type { Pagination } from '@/types/pagination'

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'SALES' | 'GUDANG'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
}

export type UserListResponse = {
  code: number
  success: boolean
  message: string
  data: {
    users: User[]
    pagination: Pagination
  }
}

export type UserItemResponse = {
  code: number
  success: boolean
  message: string
  data: {
    user: User
  }
}

export type UserErrorResponse = {
  code: number
  success: false
  message: string
  errors: Record<string, string> | null
}

export type CreateUserPayload = {
  name: string
  email: string
  role: UserRole
  password: string
}

export type UpdateUserPayload = {
  name: string
  email: string
  role: UserRole
  password?: string
}
