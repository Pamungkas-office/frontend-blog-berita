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

  async updateProfile(payload: { name?: string; email?: string }) {
    const { data } = await api.put<ApiResponse<User>>('/auth/profile', payload)
    return data.data
  },

  async logout() {
    await api.post(ROUTES.LOGOUT)
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<ApiResponse<null>>(ROUTES.FORGOT_PASSWORD, { email })
    return data
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post<ApiResponse<null>>(ROUTES.RESET_PASSWORD, { token, password })
    return data
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.post<ApiResponse<null>>('/auth/change-password', { currentPassword, newPassword })
    return data
  },

  async verifyEmail(token: string) {
    const { data } = await api.get<ApiResponse<null>>(ROUTES.VERIFY_EMAIL, { params: { token } })
    return data
  },

  async resendVerification(email: string) {
    const { data } = await api.post<ApiResponse<null>>(ROUTES.RESEND_VERIFICATION, { email })
    return data
  },
}
