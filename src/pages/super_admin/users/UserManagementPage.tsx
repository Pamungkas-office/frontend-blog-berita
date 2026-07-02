import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Loading } from '../../../components/common/Loading'
import { EmptyState } from '../../../components/common/EmptyState'
import { Pagination } from '../../../components/common/Pagination'
import { formatDate } from '../../../utils/formatDate'
import { superAdminUserService } from '../../../services/super_admin/user'
import { formatStatus } from '../../../utils/formatStatus'

const LIMIT = 10

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  master_admin_id: string | null
  is_approver: boolean
}

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createData, setCreateData] = useState({ name: '', email: '', password: '', is_approver: false })
  const [creating, setCreating] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editData, setEditData] = useState({ name: '', email: '', password: '', is_approver: false })
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = (p: number) => {
    setLoading(true)
    superAdminUserService.getUsers(p, LIMIT)
      .then((res) => {
        setUsers(res.data.data as AdminUser[])
        setTotalPages(res.data.pagination?.totalPages ?? 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers(page) }, [page])

  const handleCreate = async () => {
    setCreating(true)
    setError('')
    try {
      const res = await superAdminUserService.createAdmin(createData)
      setShowCreateModal(false)
      setCreateData({ name: '', email: '', password: '', is_approver: false })
      setSuccessMsg(res.message)
      setTimeout(() => setSuccessMsg(''), 5000)
      fetchUsers(1)
      setPage(1)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal membuat admin')
    } finally {
      setCreating(false)
    }
  }

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setEditData({ name: user.name, email: user.email, password: '', is_approver: user.is_approver })
    setError('')
  }

  const handleEdit = async () => {
    setEditing(true)
    setError('')
    try {
      await superAdminUserService.updateAdmin(editingUser!.id, editData)
      setEditingUser(null)
      setEditData({ name: '', email: '', password: '', is_approver: false })
      fetchUsers(page)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal memperbarui admin')
    } finally {
      setEditing(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return
    try {
      await superAdminUserService.deleteUser(userId)
      fetchUsers(page)
    } catch {}
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola akun admin</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Admin
        </Button>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 border border-green-200">
          {successMsg}
        </div>
      )}

      {users.length === 0 ? (
        <EmptyState message="Belum ada admin" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Approver</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {formatStatus(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_approver ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.is_approver ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.created_at) || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'super_admin' && (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {user.role !== 'super_admin' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {formatStatus(user.role)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.is_approver ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.is_approver ? 'Approver' : 'Non-approver'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Joined {formatDate(user.created_at) || '-'}
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Tambah Admin Baru">
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <Input label="Nama" value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value })} />
          <Input label="Email" type="email" value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} />
          <Input label="Password" type="password" value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={createData.is_approver} onChange={(e) => setCreateData({ ...createData, is_approver: e.target.checked })} className="rounded text-navy-700 focus:ring-navy-700" />
            <span className="text-sm text-gray-700">Beri hak approval</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Batal</Button>
            <Button loading={creating} onClick={handleCreate}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingUser} onClose={() => { setEditingUser(null); setError('') }} title="Edit Admin">
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
          <Input label="Nama" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <Input label="Email" type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
          <Input label="Password (kosongkan jika tidak diubah)" type="password" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editData.is_approver} onChange={(e) => setEditData({ ...editData, is_approver: e.target.checked })} className="rounded text-navy-700 focus:ring-navy-700" />
            <span className="text-sm text-gray-700">Beri hak approval</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setEditingUser(null); setError('') }}>Batal</Button>
            <Button loading={editing} onClick={handleEdit}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
