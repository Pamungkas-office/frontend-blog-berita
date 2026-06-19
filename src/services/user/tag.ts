import api from '../../lib/axios'
import type { ApiResponse, Tag } from '../../types'

export const tagService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Tag[]>>('/tags')
    return data.data
  },
}
