import api from '../../lib/axios'
import type { ApiResponse, Tag } from '../../types'

export const adminTagService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Tag[]>>('/tags')
    return data.data
  },

  async create(formData: { name: string; slug: string }) {
    const { data } = await api.post<ApiResponse<Tag>>('/admin/tags', formData)
    return data.data
  },

  async update(id: string, formData: { name: string; slug: string }) {
    const { data } = await api.put<ApiResponse<Tag>>(`/admin/tags/${id}`, formData)
    return data.data
  },

  async delete(id: string) {
    await api.delete(`/admin/tags/${id}`)
  },
}
