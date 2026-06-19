import api from '../../lib/axios'
import type { ApiResponse, Category } from '../../types'

export const categoryService = {
  async getAll() {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories')
    return data.data
  },
}
