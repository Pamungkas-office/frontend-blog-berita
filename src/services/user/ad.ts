import api from '../../lib/axios'
import type { ApiResponse, AdPosition } from '../../types'

export const adService = {
  async getActive(position: string) {
    const { data } = await api.get<ApiResponse<AdPosition | null>>(`/ad-positions/${position}`)
    return data.data
  },
}
