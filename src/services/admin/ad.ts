import api from '../../lib/axios'
import type { ApiResponse, AdPosition } from '../../types'

export const adminAdService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<AdPosition[]>>('/admin/ad-positions')
    return data.data
  },

  async create(formData: { position: string; ad_code: string; is_active: boolean }) {
    const { data } = await api.post<ApiResponse<AdPosition>>('/admin/ad-positions', formData)
    return data.data
  },

  async update(id: number, formData: { ad_code: string; is_active: boolean }) {
    const { data } = await api.put<ApiResponse<AdPosition>>(`/admin/ad-positions/${id}`, formData)
    return data.data
  },

  async delete(id: number) {
    await api.delete(`/admin/ad-positions/${id}`)
  },
}
