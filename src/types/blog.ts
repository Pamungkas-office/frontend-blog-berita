export interface Post {
  id: string
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  status: 'draft' | 'published'
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
