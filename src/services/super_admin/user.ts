import api from '../../lib/axios'
import type { ApiResponse } from '../../types'

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface PaginatedData<T> {
  data: T[]
  pagination: PaginationInfo | null
}

export const superAdminUserService = {
  async getUsers(page?: number, limit?: number) {
    const params = page && limit ? { page, limit } : undefined
    const { data } = await api.get<ApiResponse<PaginatedData<unknown>>>('/admin/super-admin/users', { params })
    return data
  },

  async createAdmin(payload: { name: string; email: string; password: string; is_approver: boolean }) {
    const { data } = await api.post<ApiResponse<unknown>>('/admin/super-admin/users', payload)
    return data
  },

  async updateAdmin(userId: string, payload: { name?: string; email?: string; password?: string; is_approver?: boolean }) {
    const { data } = await api.put<ApiResponse<unknown>>(`/admin/super-admin/users/${userId}`, payload)
    return data.data
  },

  async deleteUser(userId: string) {
    const { data } = await api.delete<ApiResponse<unknown>>(`/admin/super-admin/users/${userId}`)
    return data.data
  },

  async getDashboard() {
    const { data } = await api.get<ApiResponse<unknown>>('/admin/super-admin/dashboard')
    return data.data
  },
}
