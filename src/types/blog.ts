export interface Post {
  id: string
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  status: 'draft' | 'waiting_approval' | 'approved' | 'revision' | 'published'
  categoryId?: string
  category_id?: string
  category?: Category
  tags?: Tag[]
  post_tags?: { tag: Tag }[]
  authorId?: string
  author?: Author
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  created_at?: string
  meta_title?: string
  meta_description?: string
  view_count?: number
  published_at?: string
  approval_cycle?: number
  log_approvals?: LogApproval[]
  total_approvals?: number
  min_admin_approvals?: number
}

export interface LogApproval {
  id: string
  post_id: string
  approver_id: string
  /** 0 = revision, 1 = approved */
  action: 0 | 1
  notes?: string | null
  is_active: boolean
  created_at: string
  approver: { id: string; name: string }
  post?: Pick<Post, 'id' | 'title' | 'slug' | 'status'>
}

export interface ApprovalConfig {
  id: string
  min_admin_approvals: number
  updated_at?: string
}

export interface MasterAdminEntry {
  id: string
  name: string
  email: string
  master_admin_id: string | null
  is_approver: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at?: string
}

export interface Author {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface GenerateResult {
  title: string
  news: string
  category: string[]
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  provider?: string
}
