import api from '../../lib/axios'
import type { ApiResponse, PaginatedResponse, Comment } from '../../types'

export const adminCommentService = {
  async getAll(page = 1, limit = 10) {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Comment>>>('/admin/comments', {
      params: { page, limit },
    })
    return data.data
  },

  async delete(id: number) {
    await api.delete(`/admin/comments/${id}`)
  },
}
