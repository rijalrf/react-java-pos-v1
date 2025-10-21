import { apiClient } from '@/services/apiClient'

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserItemResponse,
  UserListResponse,
} from '../types/user'

export type UserQuery = {
  name?: string
  page?: number
  size?: number
  sort?: string
}

export const userService = {
  async getUsers(query?: UserQuery) {
    return apiClient<UserListResponse>('/users', { query })
  },
  async getUserById(id: number) {
    return apiClient<UserItemResponse>(`/users/${id}`)
  },
  async createUser(payload: CreateUserPayload) {
    return apiClient<UserItemResponse>('/users', {
      method: 'POST',
      body: payload,
    })
  },
  async updateUser(id: number, payload: UpdateUserPayload) {
    return apiClient<UserItemResponse>(`/users/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  async deleteUser(id: number) {
    await apiClient<void>(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}
