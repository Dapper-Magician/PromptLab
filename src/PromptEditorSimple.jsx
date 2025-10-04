import React, { useState, useEffect } from 'react'
import { Save, X, Star, Copy, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PromptEditorSimple({ prompt, categories, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Initialize form data when prompt changes
  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title || '')
      setContent(prompt.content || '')
      setDescription(prompt.description || '')
      setCategoryId(prompt.category_id || '')
      setIsFavorite(prompt.is_favorite || false)
      setIsDirty(false)
    } else {
      // New prompt - keep current values or set defaults
      if (!title && !content) {
        setTitle('')
        setContent('')
        setDescription('')
        setCategoryId('')
        setIsFavorite(false)
        setIsDirty(false)
      }
    }
  }, [prompt])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required')
      return
    }

    setSaving(true)
    try {
      const promptData = {
        id: prompt?.id || null,
        title: title.trim(),
        content: content.trim(),
        description: description.trim(),
        category_id: categoryId || null,
        is_favorite: isFavorite,
        is_template: false,
        tags: [],
        author: '',
        source: '',
        version: '1.0.0'
      }

      await onSave(promptData)
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to save prompt:', error)
      alert('Failed to save prompt. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyContent = () => {
    if (content) {
      navigator.clipboard.writeText(content)
      // TODO: Show toast notification
    }
  }

  const markDirty = () => {
    if (!isDirty) {
      setIsDirty(true)
    }
  }

  // Show placeholder when no prompt is selected and form is empty
  if (!prompt && !title && !content && !isDirty) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No prompt selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a prompt from the list or create a new one
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-semibold">
                {prompt?.id ? 'Edit Prompt' : 'New Prompt'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {prompt?.id ? `Last updated ${new Date(prompt.updated_at || Date.now()).toLocaleDateString()}` : 'Create a new prompt'}
              </p>
            </div>
            {isDirty && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
              disabled={!content}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim() || !content.trim()}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>

            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    markDirty()
                  }}
                  placeholder="Enter prompt title..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    markDirty()
                  }}
                  placeholder="Enter your prompt content here..."
                  className="mt-1 min-h-[200px]"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    markDirty()
                  }}
                  placeholder="Brief description of what this prompt does..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={(value) => {
                    setCategoryId(value)
                    markDirty()
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No category</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="favorite"
                    checked={isFavorite}
                    onChange={(e) => {
                      setIsFavorite(e.target.checked)
                      markDirty()
                    }}
                    className="rounded"
                  />
                  <Label htmlFor="favorite" className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Mark as favorite
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

