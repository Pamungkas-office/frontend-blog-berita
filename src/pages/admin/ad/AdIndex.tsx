import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Code } from 'lucide-react'
import { adminAdService } from '../../../services/admin/ad'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import type { AdPosition } from '../../../types'

const positionLabels: Record<string, string> = {
  auto_ads: 'Auto Ads (Head)',
  header: 'Header Banner',
  sidebar: 'Sidebar',
  in_article: 'Dalam Artikel',
  footer: 'Footer Banner',
}

const positionOptions = [
  { value: 'auto_ads', label: 'Auto Ads (Head)' },
  { value: 'header', label: 'Header Banner' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'in_article', label: 'Dalam Artikel' },
  { value: 'footer', label: 'Footer Banner' },
]

export function AdIndex() {
  const [ads, setAds] = useState<AdPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<AdPosition | null>(null)
  const [createMode, setCreateMode] = useState(false)
  const [formPosition, setFormPosition] = useState('header')
  const [formCode, setFormCode] = useState('')
  const [formActive, setFormActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdPosition | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = () => {
    setLoading(true)
    adminAdService
      .getAll()
      .then(setAds)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setCreateMode(true)
    setEditTarget(null)
    setFormPosition('header')
    setFormCode('')
    setFormActive(true)
  }

  const openEdit = (ad: AdPosition) => {
    setEditTarget(ad)
    setCreateMode(false)
    setFormPosition(ad.position)
    setFormCode(ad.ad_code)
    setFormActive(ad.is_active)
  }

  const handleSave = async () => {
    if (!formCode.trim()) return
    setSaving(true)
    try {
      if (editTarget) {
        await adminAdService.update(editTarget.id, { ad_code: formCode, is_active: formActive })
      } else {
        await adminAdService.create({ position: formPosition, ad_code: formCode, is_active: formActive })
      }
      setEditTarget(null)
      setCreateMode(false)
      fetchData()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminAdService.delete(deleteTarget.id)
      setAds((prev) => prev.filter((a) => a.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Iklan</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola posisi iklan Google AdSense</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Iklan
        </Button>
      </div>

      {ads.length === 0 ? (
        <EmptyState message="Belum ada iklan. Tambahkan iklan Google AdSense sekarang!" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Posisi</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Kode Iklan</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {positionLabels[ad.position] ?? ad.position}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {ad.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {ad.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate font-mono">
                      {ad.ad_code.slice(0, 80)}...
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(ad)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(ad)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Code className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {positionLabels[ad.position] ?? ad.position}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          ad.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {ad.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {ad.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(ad)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(ad)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 font-mono truncate">{ad.ad_code.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={!!editTarget || createMode}
        onClose={() => { setEditTarget(null); setCreateMode(false) }}
        title={editTarget ? 'Edit Iklan' : 'Tambah Iklan'}
      >
        <div className="space-y-4">
          {!editTarget && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
              <select
                value={formPosition}
                onChange={(e) => setFormPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red-700"
              >
                {positionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {editTarget && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
              <p className="text-sm text-gray-900 font-medium">{positionLabels[editTarget.position]}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Iklan (HTML / Script)
            </label>
            <textarea
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-red-700 focus:border-transparent"
              placeholder="Paste kode Google AdSense di sini..."
            />
            <p className="mt-1 text-xs text-gray-400">
              Paste kode Google AdSense (tag ins + script) untuk posisi ini.
              Untuk Auto Ads, paste script auto ads Google.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="rounded border-gray-300 text-brand-red-700 focus:ring-brand-red-700"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Iklan Aktif</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditTarget(null); setCreateMode(false) }}>
              Batal
            </Button>
            <Button loading={saving} onClick={handleSave} disabled={!formCode.trim()}>
              {editTarget ? 'Simpan' : 'Tambah'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Iklan"
      >
        <p className="text-sm text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus iklan posisi{' '}
          <strong>{deleteTarget ? positionLabels[deleteTarget.position] : ''}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}
