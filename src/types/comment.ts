export interface Comment {
  id: number
  comment: string
  created_at: string
  post_id: number
  user: {
    id: number
    name: string
  } | null
  post?: {
    id: number
    title: string
    slug: string
  }
}
