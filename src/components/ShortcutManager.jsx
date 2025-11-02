import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  Zap,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ShortcutManager() {
  const [shortcuts, setShortcuts] = useState([])
  const [filteredShortcuts, setFilteredShortcuts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingShortcut, setEditingShortcut] = useState(null)

  // Fetch shortcuts from API
  const fetchShortcuts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5002/api/shortcuts')
      if (!response.ok) throw new Error('Failed to fetch shortcuts')
      const data = await response.json()
      setShortcuts(data)
      setFilteredShortcuts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShortcuts()
  }, [])

  // Filter shortcuts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredShortcuts(shortcuts)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = shortcuts.filter(shortcut =>
      shortcut.trigger.toLowerCase().includes(query) ||
      shortcut.expansion.toLowerCase().includes(query) ||
      (shortcut.description && shortcut.description.toLowerCase().includes(query))
    )
    setFilteredShortcuts(filtered)
  }, [searchQuery, shortcuts])

  const handleCreate = () => {
    setEditingShortcut(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (shortcut) => {
    setEditingShortcut(shortcut)
    setIsEditorOpen(true)
  }

  const handleDelete = async (shortcut) => {
    if (!confirm(`Delete shortcut "${shortcut.trigger}"?`)) return

    try {
      const response = await fetch(`http://localhost:5002/api/shortcuts/${shortcut.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete shortcut')
      
      await fetchShortcuts()
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleToggleActive = async (shortcut) => {
    try {
      const response = await fetch(`http://localhost:5002/api/shortcuts/${shortcut.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !shortcut.is_active })
      })
      if (!response.ok) throw new Error('Failed to update shortcut')
      
      await fetchShortcuts()
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleCopyExpansion = (expansion) => {
    navigator.clipboard.writeText(expansion)
  }

  const handleSave = async (shortcutData) => {
    try {
      const url = editingShortcut
        ? `http://localhost:5002/api/shortcuts/${editingShortcut.id}`
        : 'http://localhost:5002/api/shortcuts'
      
      const response = await fetch(url, {
        method: editingShortcut ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shortcutData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save shortcut')
      }

      await fetchShortcuts()
      setIsEditorOpen(false)
    } catch (err) {
      throw err
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading shortcuts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={fetchShortcuts} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Text Shortcuts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create text expansions that trigger automatically as you type
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Shortcut
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredShortcuts.length} shortcuts</span>
        <span>•</span>
        <span>{filteredShortcuts.filter(s => s.is_active).length} active</span>
      </div>

      {/* Shortcuts List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredShortcuts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No shortcuts found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Create your first shortcut to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shortcut
                </Button>
              )}
            </motion.div>
          ) : (
            filteredShortcuts.map((shortcut) => (
              <motion.div
                key={shortcut.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`${!shortcut.is_active ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Trigger */}
                        <code className="px-2 py-1 bg-secondary rounded text-sm font-mono whitespace-nowrap">
                          {shortcut.trigger}
                        </code>
                        
                        {/* Arrow */}
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        
                        {/* Expansion Preview */}
                        <span className="text-sm truncate max-w-xs lg:max-w-md">
                          {shortcut.expansion}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Use Count Badge */}
                        <Badge variant="secondary" className="text-xs">
                          {shortcut.use_count || 0} uses
                        </Badge>

                        {/* Active Toggle */}
                        <Switch
                          checked={shortcut.is_active}
                          onCheckedChange={() => handleToggleActive(shortcut)}
                        />

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(shortcut)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyExpansion(shortcut.expansion)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Expansion
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(shortcut)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Description */}
                    {shortcut.description && (
                      <p className="text-xs text-muted-foreground mt-2 ml-1">
                        {shortcut.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Editor Dialog */}
      <ShortcutEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        shortcut={editingShortcut}
      />
    </div>
  )
}

// Shortcut Editor Dialog Component
function ShortcutEditor({ isOpen, onClose, onSave, shortcut }) {
  const [formData, setFormData] = useState({
    trigger: '',
    expansion: '',
    description: '',
    is_active: true
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (shortcut) {
      setFormData({
        trigger: shortcut.trigger,
        expansion: shortcut.expansion,
        description: shortcut.description || '',
        is_active: shortcut.is_active
      })
    } else {
      setFormData({
        trigger: '',
        expansion: '',
        description: '',
        is_active: true
      })
    }
    setError(null)
  }, [shortcut, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.trigger.trim()) {
      setError('Trigger is required')
      return
    }
    if (!formData.expansion.trim()) {
      setError('Expansion is required')
      return
    }
    if (formData.trigger.length > 50) {
      setError('Trigger must be 50 characters or less')
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {shortcut ? 'Edit Shortcut' : 'Create Shortcut'}
          </DialogTitle>
          <DialogDescription>
            Create a text expansion that triggers automatically when you type the trigger.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="trigger">
              Trigger <span className="text-destructive">*</span>
            </Label>
            <Input
              id="trigger"
              value={formData.trigger}
              onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
              placeholder=":email, /hello, or no prefix..."
              className="font-mono"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Short text that triggers the expansion (2-20 chars recommended)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expansion">
              Expansion <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="expansion"
              value={formData.expansion}
              onChange={(e) => setFormData({ ...formData, expansion: e.target.value })}
              placeholder="What to replace the trigger with..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Can be multi-line text
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description..."
              maxLength={200}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : shortcut ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}