export interface AdPosition {
  id: number
  position: 'auto_ads' | 'header' | 'sidebar' | 'in_article' | 'footer'
  ad_code: string
  is_active: boolean
}
