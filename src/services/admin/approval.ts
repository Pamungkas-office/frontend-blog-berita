import api from '../../lib/axios'
import type { ApiResponse, Post, LogApproval, ApprovalConfig, MasterAdminEntry } from '../../types'

interface PaginatedHistory {
  data: LogApproval[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface PaginatedQueue {
  data: Post[]
  pagination: PaginationInfo | null
}

export const adminApprovalService = {
  async getQueue(page = 1, limit = 10) {
    const { data } = await api.get<ApiResponse<PaginatedQueue>>('/admin/approval/queue', { params: { page, limit } })
    return data.data
  },

  async getHistory(page = 1, limit = 20) {
    const { data } = await api.get<ApiResponse<PaginatedHistory>>('/admin/approval/history', {
      params: { page, limit },
    })
    return data.data
  },

  async approve(postId: string) {
    const { data } = await api.post<ApiResponse<unknown>>(`/admin/approval/${postId}/approve`)
    return data.data
  },

  async revision(postId: string, notes: string) {
    const { data } = await api.post<ApiResponse<unknown>>(`/admin/approval/${postId}/revision`, { notes })
    return data.data
  },

  async getRevisionNotes(postId: string) {
    const { data } = await api.get<ApiResponse<{ notes: string | null; approver_name: string }>>(`/admin/approval/${postId}/revision-notes`)
    return data.data
  },

  async resubmit(postId: string) {
    const { data } = await api.post<ApiResponse<unknown>>(`/admin/approval/${postId}/resubmit`)
    return data.data
  },

  async publish(postId: string) {
    const { data } = await api.post<ApiResponse<unknown>>(`/admin/approval/${postId}/publish`)
    return data.data
  },

  async getConfig() {
    const { data } = await api.get<ApiResponse<ApprovalConfig>>('/admin/approval/config')
    return data.data
  },

  async updateConfig(minAdminApprovals: number) {
    const { data } = await api.put<ApiResponse<ApprovalConfig>>('/admin/approval/config', {
      min_admin_approvals: minAdminApprovals,
    })
    return data.data
  },

  async getMasterAdmins() {
    const { data } = await api.get<ApiResponse<MasterAdminEntry[]>>('/admin/approval/master-admins')
    return data.data
  },

  async toggleMasterAdmin(userId: string, isApprover: boolean) {
    const { data } = await api.put<ApiResponse<unknown>>(`/admin/approval/master-admins/${userId}`, {
      is_approver: isApprover,
    })
    return data.data
  },

}
