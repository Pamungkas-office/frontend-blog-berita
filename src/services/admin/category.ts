import api from '../../lib/axios'
import type { ApiResponse, Category } from '../../types'

export const adminCategoryService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories')
    return data.data
  },

  async create(formData: { name: string; slug: string }) {
    const { data } = await api.post<ApiResponse<Category>>('/admin/categories', formData)
    return data.data
  },

  async update(id: string, formData: { name: string; slug: string }) {
    const { data } = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, formData)
    return data.data
  },

  async delete(id: string) {
    await api.delete(`/admin/categories/${id}`)
  },
}
