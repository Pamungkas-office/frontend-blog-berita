import api from '../../lib/axios'
import type { PaginatedResponse, Post } from '../../types'

export const blogService = {
  async getAllPublished(params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) {
    const { data } = await api.get<PaginatedResponse<Post>>('/posts', { params })
    return data
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<{ success: boolean; message: string; data: Post }>(`/posts/${slug}`)
    return data.data
  },
}
