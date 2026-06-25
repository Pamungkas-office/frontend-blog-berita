import api from '../../lib/axios'
import type { ApiResponse, Post, GenerateResult } from '../../types'

interface SaveGeneratedPayload {
  title: string
  news: string
  category: string[]
  tags: string[]
  meta_title?: string | null
  meta_description?: string | null
}

export const adminBlogService = {
  async getAll(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get<ApiResponse<Post[]>>('/admin/posts', { params })
    return data
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Post>>(`/admin/posts/${id}`)
    return data.data
  },

  async create(formData: FormData) {
    const { data } = await api.post<ApiResponse<Post>>('/admin/posts', formData)
    return data.data
  },

  async update(id: string, formData: FormData) {
    const { data } = await api.put<ApiResponse<Post>>(`/admin/posts/${id}`, formData)
    return data.data
  },

  async delete(id: string) {
    await api.delete(`/admin/posts/${id}`)
  },

  async generate(url: string) {
    const { data } = await api.post<ApiResponse<GenerateResult>>('/admin/posts/generate', { url })
    return data.data
  },

  async saveGenerated(payload: SaveGeneratedPayload) {
    const { data } = await api.post<ApiResponse<Post>>('/admin/posts/save-generated', payload)
    return data.data
  },
}
