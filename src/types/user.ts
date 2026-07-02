export interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'user'
  avatar?: string
  createdAt?: string
  updatedAt?: string
  is_approver?: boolean
}
