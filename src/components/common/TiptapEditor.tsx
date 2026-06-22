import { useEditor, EditorContent, type Content } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon,
} from 'lucide-react'
import { useCallback } from 'react'

interface TiptapEditorProps {
  value: string
  onChange: (html: string) => void
  label?: string
  error?: string
}

export function TiptapEditor({ value, onChange, label, error }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-red-700 underline' } }),
    ],
    content: (value || '<p></p>') as Content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        editor?.chain().focus().setImage({ src: url }).run()
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }, [editor])

  const handleLinkClick = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Masukkan URL:', previousUrl || 'https://')
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const ToolButton = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition-colors ${active ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-bg-light hover:text-navy-700'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-navy-700">{label}</label>}
      <div className={`border rounded-lg overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-bg-light">
          <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <Bold className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <Italic className="w-4 h-4" />
          </ToolButton>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
            <Heading1 className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
            <Heading2 className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
            <Heading3 className="w-4 h-4" />
          </ToolButton>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            <List className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
            <ListOrdered className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
            <Quote className="w-4 h-4" />
          </ToolButton>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <ToolButton onClick={handleImageUpload}>
            <ImageIcon className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={handleLinkClick} active={editor.isActive('link')}>
            <LinkIcon className="w-4 h-4" />
          </ToolButton>
          <span className="ml-auto" />
          <ToolButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4" />
          </ToolButton>
        </div>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
