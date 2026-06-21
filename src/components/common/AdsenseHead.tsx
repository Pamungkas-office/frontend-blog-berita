import { useEffect, useState } from 'react'
import { adService } from '../../services/user/ad'

export function AdsenseHead() {
  const [autoAdsScript, setAutoAdsScript] = useState<string | null>(null)

  useEffect(() => {
    adService.getActive('auto_ads').then((data) => {
      if (data?.ad_code) {
        setAutoAdsScript(data.ad_code)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!autoAdsScript) return

    const container = document.createElement('div')
    container.innerHTML = autoAdsScript

    const elements = Array.from(container.children)

    elements.forEach((el) => {
      if (el.tagName === 'SCRIPT') {
        const script = document.createElement('script')
        Array.from(el.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value)
        })
        script.textContent = el.textContent
        document.head.appendChild(script)
      } else {
        document.head.appendChild(el.cloneNode(true))
      }
    })

    return () => {
      elements.forEach((el) => {
        if (el.tagName === 'SCRIPT') {
          const scripts = document.head.querySelectorAll(`script[src="${el.getAttribute('src')}"]`)
          scripts.forEach((s) => s.remove())
        }
      })
    }
  }, [autoAdsScript])

  return null
}
