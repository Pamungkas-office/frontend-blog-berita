import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  value?: string | null
  onChange: (file: File | null) => void
  label?: string
  error?: string
}

export function ImageUpload({ value, onChange, label, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value ?? null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors text-center ${
          error ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Upload className="w-8 h-8" />
            <p className="text-sm">Klik untuk upload thumbnail</p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF — Maks 2MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
