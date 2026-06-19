import api from '../lib/axios'
import { ROUTES } from '../lib/constants';
import type { ApiResponse, User } from '../types'

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(ROUTES.LOGIN, { email, password })
    return data.data
  },

  async register(name: string, email: string, password: string) {
    const { data } = await api.post<ApiResponse<User>>(ROUTES.REGISTER, { name, email, password })
    return data.data
  },

  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>(ROUTES.ME)
    console.log(data)
    return data.data
  },

  async updateProfile(formData: FormData) {
    const { data } = await api.put<ApiResponse<User>>('/auth/profile', formData)
    return data.data
  },

  async logout() {
    await api.post(ROUTES.LOGOUT)
  },
}
