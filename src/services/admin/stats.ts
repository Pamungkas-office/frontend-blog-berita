import api from '../../lib/axios'
import type { ApiResponse } from '../../types'

interface TotalViewsResponse {
  total_views: number
}

export const adminStatsService = {
  async getTotalViews() {
    const { data } = await api.get<ApiResponse<TotalViewsResponse>>('/admin/stats/total-views')
    return data.data.total_views
  },
}
