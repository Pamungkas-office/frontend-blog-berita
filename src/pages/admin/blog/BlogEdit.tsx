import { adminApprovalService } from '../../../services/admin/approval'
import { BlogEditForm } from '../../../components/blog/BlogEditForm'

export function BlogEdit() {
  return (
    <BlogEditForm
      approvalService={adminApprovalService}
      redirectPath="/admin/blog"
    />
  )
}
