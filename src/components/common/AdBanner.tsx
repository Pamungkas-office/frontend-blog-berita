import { useEffect, useState, useRef } from 'react'
import { adService } from '../../services/user/ad'
import type { AdPosition } from '../../types'

interface AdBannerProps {
  position: 'header' | 'sidebar' | 'in_article' | 'footer'
  className?: string
}

const heightClasses: Record<string, string> = {
  header: 'min-h-[90px]',
  sidebar: 'min-h-[250px]',
  in_article: 'min-h-[120px]',
  footer: 'min-h-[90px]',
}

export function AdBanner({ position, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<AdPosition | null>(null)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded) {
          setLoaded(true)
          adService.getActive(position).then((data) => {
            setAd(data ?? null)
          }).catch(() => {})
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [position, loaded])

  if (!ad) {
    return (
      <div
        ref={ref}
        className={`w-full ${heightClasses[position] ?? 'min-h-[90px]'} ${className}`}
      />
    )
  }

  return (
    <div
      className={`w-full flex justify-center overflow-hidden ${className}`}
    >
      <div
        className="max-w-full"
        dangerouslySetInnerHTML={{ __html: ad.ad_code }}
      />
    </div>
  )
}
