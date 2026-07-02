import { useEffect, useState } from 'react'
import { adminApprovalService } from '../../../services/admin/approval'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Loading } from '../../../components/common/Loading'
import type { MasterAdminEntry } from '../../../types'

export function ApprovalConfigPage() {
  const [admins, setAdmins] = useState<MasterAdminEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [minApprovals, setMinApprovals] = useState(2)
  const [saving, setSaving] = useState(false)
  const [savingAdmin, setSavingAdmin] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      adminApprovalService.getConfig(),
      adminApprovalService.getMasterAdmins(),
    ])
      .then(([cfg, adms]) => {
        setMinApprovals(cfg.min_admin_approvals)
        setAdmins(adms)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      await adminApprovalService.updateConfig(minApprovals)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const toggleApprover = async (userId: string, current: boolean) => {
    setSavingAdmin(userId)
    try {
      await adminApprovalService.toggleMasterAdmin(userId, !current)
      fetchData()
    } catch {
    } finally {
      setSavingAdmin(null)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approval Config</h1>
        <p className="mt-1 text-sm text-gray-500">
          Atur konfigurasi approval berita
        </p>
      </div>

      {/* Threshold Config */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Threshold Approval 
        </h2>
        <div className="max-w-xl">
          <Input
            label="Minimal Admin Approver (Termasuk Super Admin)"
            type="number"
            min={1}
            value={minApprovals}
            onChange={(e) => setMinApprovals(Number(e.target.value))}
            hint="Jumlah minimum admin approver yang harus approve (super_admin selalu diperlukan)"
          />
        </div>
        <div className="mt-4">
          <Button loading={saving} onClick={handleSaveConfig}>
            Simpan Config
          </Button>
        </div>
      </div>

      {/* Master Admin List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Master Admin — Hak Approval
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Atur admin mana yang memiliki hak approval
          </p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="px-4 lg:px-6 py-3 font-medium">Name</th>
              <th className="px-4 lg:px-6 py-3 font-medium">Email</th>
              <th className="px-4 lg:px-6 py-3 font-medium">Approver</th>
              <th className="px-4 lg:px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">
                  {admin.name}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                  {admin.email}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.is_approver
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {admin.is_approver ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 text-right">
                  <Button
                    variant={admin.is_approver ? 'secondary' : 'primary'}
                    size="sm"
                    loading={savingAdmin === admin.id}
                    onClick={() => toggleApprover(admin.id, admin.is_approver)}
                  >
                    {admin.is_approver ? 'Revoke' : 'Grant'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
