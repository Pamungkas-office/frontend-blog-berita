import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TiptapEditor } from '../common/TiptapEditor'

interface RevisionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (notes: string) => Promise<void>
  postTitle: string
}

export function RevisionModal({ isOpen, onClose, onSubmit, postTitle }: RevisionModalProps) {
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!notes || notes.length < 10) {
      setError('Catatan revisi minimal 10 karakter')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(notes)
      setNotes('')
      onClose()
    } catch {
      setError('Gagal mengirim revisi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Revision">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Berikan catatan revisi untuk: <strong>{postTitle}</strong>
        </p>

        <TiptapEditor
          label="Catatan Revisi"
          value={notes}
          onChange={setNotes}
          error={error}
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button loading={submitting} onClick={handleSubmit}>
            Kirim Revisi
          </Button>
        </div>
      </div>
    </Modal>
  )
}
