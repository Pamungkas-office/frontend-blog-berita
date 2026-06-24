export const API_URL = import.meta.env.VITE_API_URL || 'https://backend-blog-berita.vercel.app/api'

export const ROUTES = {
  ME: '/auth/me',
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  BLOG: '/blog',
  BLOG_DETAIL: (slug: string) => `/blog/${slug}`,
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    BLOG: '/admin/blog',
    BLOG_CREATE: '/admin/blog/create',
    BLOG_EDIT: (id: string) => `/admin/blog/${id}/edit`,
    CATEGORY: '/admin/category',
    CATEGORY_CREATE: '/admin/category/create',
    CATEGORY_EDIT: (id: string) => `/admin/category/${id}/edit`,
    TAG: '/admin/tag',
    TAG_CREATE: '/admin/tag/create',
    TAG_EDIT: (id: string) => `/admin/tag/${id}/edit`,
    COMMENT: '/admin/comment',
  },
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/password/forgot-password',
  RESET_PASSWORD: '/password/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const
