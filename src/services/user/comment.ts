import api from '../../lib/axios'
import type { ApiResponse, Comment } from '../../types'

export const commentService = {
  async getByPost(slug: string) {
    const { data } = await api.get<ApiResponse<Comment[]>>(`/comments/${slug}`)
    return data.data
  },

  async create(slug: string, comment: string) {
    const { data } = await api.post<ApiResponse<Comment>>(`/comments/${slug}`, { comment })
    return data.data
  },

  async delete(id: number) {
    await api.delete(`/comments/${id}`)
  },
}
