import { useState, useEffect, useCallback, useRef } from 'react'

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const execute = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcherRef.current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, deps)

  useEffect(() => {
    const cancel = execute()
    return cancel
  }, [execute])

  return { data, loading, error, refetch: execute }
}
