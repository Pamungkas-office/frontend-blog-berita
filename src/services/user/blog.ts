import api from '../../lib/axios'
import type { PaginatedResponse, Post } from '../../types'
import { getVisitorId } from '../../utils/visitor'

export const blogService = {
  async getAllPublished(params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) {
    const { data } = await api.get<PaginatedResponse<Post>>('/posts', { params })
    return data
  },

  async getBySlug(slug: string) {
    const { data } = await api.get<{ success: boolean; message: string; data: Post }>(`/posts/${slug}`)
    return data.data
  },

  async recordView(slug: string) {
    const visitorId = getVisitorId()
    await api.post(`/posts/${slug}/view`, {}, {
      headers: { 'X-Visitor-Id': visitorId },
    })
  },
}
