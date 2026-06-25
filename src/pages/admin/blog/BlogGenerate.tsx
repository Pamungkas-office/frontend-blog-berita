import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { adminBlogService } from '../../../services/admin/blog'
import { Button } from '../../../components/ui/Button'
import type { GenerateResult } from '../../../types'

export function BlogGenerate() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleGenerate = async () => {
    setError('')
    setSuccess('')
    setResult(null)

    if (!url.trim()) {
      setError('Masukkan URL berita terlebih dahulu')
      return
    }

    setLoading(true)
    try {
      const res = await adminBlogService.generate(url.trim())
      setResult(res)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal generate berita'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!result) return

    setSaving(true)
    setError('')
    try {
      await adminBlogService.saveGenerated({
        title: result.title,
        news: result.news,
        category: result.category,
        tags: result.tags,
        meta_title: result.meta_title,
        meta_description: result.meta_description,
      })
      setSuccess('Berita berhasil disimpan sebagai draft!')
      setTimeout(() => navigate('/admin/blog'), 1500)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan berita'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Generate Berita dengan AI</h1>
          <p className="mt-1 text-sm text-gray-500">
            Masukkan URL berita, lalu AI akan mengubahnya ke gaya Gen Z
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 sticky top-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Berita
            </label>
            <textarea
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Masukkan URL berita yang ingin digenerate&#10;Contoh: https://www.kompas.com/..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              *Hanya 1 URL berita yang bisa diproses dalam sekali generate
            </p>
            <Button
              className="w-full mt-4"
              onClick={handleGenerate}
              loading={loading}
            >
              {!loading && <Sparkles className="w-4 h-4 mr-2" />}
              Generate
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-navy-700 animate-spin mb-4" />
              <p className="text-sm text-gray-500">AI sedang memproses berita...</p>
              <p className="text-xs text-gray-400 mt-1">Mohon tunggu beberapa saat</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {result.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {result.category.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div
                  className="prose prose-sm max-w-none border-t border-gray-100 pt-4"
                  dangerouslySetInnerHTML={{ __html: result.news }}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveDraft} loading={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Draft
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGenerate}
                  loading={loading}
                >
                  Generate Ulang
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Belum ada hasil generate
              </h3>
              <p className="text-xs text-gray-400">
                Masukkan URL berita di kolom sebelah kiri, lalu klik Generate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
