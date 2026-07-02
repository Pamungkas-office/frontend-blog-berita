import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, MessageSquare, ArrowLeft } from 'lucide-react'
import { superAdminApprovalService } from '../../../services/super_admin/approval'
import { BlogEditForm } from '../../../components/blog/BlogEditForm'
import { Button } from '../../../components/ui/Button'
import { RevisionModal } from '../../../components/approval/RevisionModal'

export function ApprovalBlogEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [revisionTarget, setRevisionTarget] = useState(false)

  const handleApprove = async () => {
    if (!id) return
    setActionLoading('approve')
    try {
      await superAdminApprovalService.approve(id)
      navigate('/super-admin/approval-queue', { replace: true })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRevision = async (notes: string) => {
    if (!id) return
    await superAdminApprovalService.revision(id, notes)
    navigate('/super-admin/approval-queue', { replace: true })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/super-admin/approval-queue')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Approval Queue
        </Button>
      </div>

      <BlogEditForm
        approvalService={superAdminApprovalService}
        redirectPath="/super-admin/approval-queue"
        contextLabel="Review & Edit Berita"
        hideCancelButton
        actionsExtra={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRevisionTarget(true)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Revisi
            </Button>
            <Button
              size="sm"
              loading={actionLoading === 'approve'}
              onClick={handleApprove}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </>
        }
      />

      <RevisionModal
        isOpen={revisionTarget}
        onClose={() => setRevisionTarget(false)}
        onSubmit={handleRevision}
        postTitle=""
      />
    </div>
  )
}
