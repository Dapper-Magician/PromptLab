import { useState, useEffect, useRef } from 'react'
import {
  Save,
  X,
  Eye,
  EyeOff,
  Star,
  Copy,
  FileText,
  Tag,
  User,
  Calendar,
  Link,
  Palette,
  Sparkles,
  Zap
} from 'lucide-react'
import { useShortcutExpansion } from '@/hooks/useShortcutExpansion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PromptEditor({ prompt, categories, onSave, onClose, onSaveAsTemplate }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    author: '',
    source: '',
    category_id: null,
    tags: [],
    is_favorite: false,
    is_template: false,
    version: '1.0.0'
  })
  const [newTag, setNewTag] = useState('')
  const [markdownPreview, setMarkdownPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showSaveAsTemplateDialog, setShowSaveAsTemplateDialog] = useState(false)
  const [shortcutExpanded, setShortcutExpanded] = useState(false)
  
  // Shortcut expansion hook
  const { expandText, shortcuts } = useShortcutExpansion()
  
  // Refs for input elements
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const descriptionRef = useRef(null)

  // Initialize form data when prompt changes
  useEffect(() => {
    if (prompt) {
      setFormData({
        ...prompt,
        tags: prompt.tags || []
      })
      setIsDirty(false)
    } else {
      // New prompt
      setFormData({
        title: '',
        content: '',
        description: '',
        author: '',
        source: '',
        category_id: null,
        tags: [],
        is_favorite: false,
        is_template: false,
        version: '1.0.0'
      })
      setIsDirty(false)
    }
  }, [prompt])

  const handleInputChange = (field, value, skipShortcutCheck = false) => {
    // Check for shortcut expansion if not skipped
    if (!skipShortcutCheck && shortcuts.length > 0) {
      const element = field === 'title' ? titleRef.current :
                      field === 'content' ? contentRef.current :
                      field === 'description' ? descriptionRef.current : null
      
      if (element) {
        const result = expandText(value, element)
        if (result.expanded) {
          // Show visual feedback
          setShortcutExpanded(true)
          setTimeout(() => setShortcutExpanded(false), 1000)
          
          // Update with expanded text
          setFormData(prev => ({
            ...prev,
            [field]: result.newText
          }))
          setIsDirty(true)
          return
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    // For existing prompts, prompt for a version message.
    if (formData.id) {
      const versionMessage = window.prompt("Describe the changes you made for this new version:", "Updated prompt content.");
      // If the user cancels the prompt, stop the save process.
      if (versionMessage === null) {
        return;
      }
      formData.version_message = versionMessage;
    }

    setSaving(true);
    try {
      // The onSave function is passed down from App.jsx
      await onSave(formData);
      setIsDirty(false);
    } catch (error) {
      // Error handling is now done in App.jsx, but we can still log here.
      console.error('Failed to save prompt:', error);
      // The toast notification will be shown from the onSave function's catch block.
    } finally {
      setSaving(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(formData.content)
    // TODO: Show toast notification
  }

  const handleSaveAsTemplate = () => {
    if (!formData.content.trim()) {
      alert('Content is required to create a template')
      return
    }
    setShowSaveAsTemplateDialog(true)
  }

  const confirmSaveAsTemplate = async () => {
    if (onSaveAsTemplate) {
      try {
        await onSaveAsTemplate({
          name: formData.title || 'Untitled Template',
          content: formData.content,
          description: formData.description,
          category_id: formData.category_id
        })
        setShowSaveAsTemplateDialog(false)
      } catch (error) {
        console.error('Failed to save as template:', error)
      }
    }
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }

  if (!prompt && formData.title === '' && formData.content === '') {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No prompt selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a prompt from the list or create a new one
          </p>
          <Button onClick={() => handleInputChange('title', 'New Prompt')}>
            <FileText className="h-4 w-4 mr-2" />
            Create New Prompt
          </Button>
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
                {prompt ? 'Edit Prompt' : 'New Prompt'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {prompt ? `Last updated ${new Date(prompt.updated_at).toLocaleDateString()}` : 'Create a new prompt'}
              </p>
            </div>
            {isDirty && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
            {shortcutExpanded && (
              <Badge variant="default" className="text-xs animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Shortcut expanded
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
              disabled={!formData.content}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>

            {onSaveAsTemplate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAsTemplate}
                disabled={!formData.content}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkdownPreview(!markdownPreview)}
            >
              {markdownPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="min-w-[80px]"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4 w-fit">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 overflow-hidden mt-4">
            <div className="h-full px-6 pb-6">
              <div className="grid grid-cols-1 gap-4 h-full">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    ref={titleRef}
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter prompt title..."
                    className="mt-1"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-0">
                  <Label htmlFor="content">Content *</Label>
                  {markdownPreview ? (
                    <Card className="flex-1 mt-1">
                      <CardContent className="p-4">
                        <ScrollArea className="h-full">
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {formData.content}
                            </pre>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ) : (
                    <Textarea
                      ref={contentRef}
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Enter your prompt content here..."
                      className="flex-1 mt-1 resize-none font-mono"
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    ref={descriptionRef}
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of what this prompt does..."
                    className="mt-1 h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-6">
                {/* Basic Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Author Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Prompt author name..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Input
                        id="source"
                        value={formData.source}
                        onChange={(e) => handleInputChange('source', e.target.value)}
                        placeholder="Where this prompt came from..."
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Organization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category_id?.toString() || ''}
                        onValueChange={(value) => handleInputChange('category_id', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                          
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                />
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <div className="mt-1 space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag..."
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                          >
                            Add
                          </Button>
                        </div>
                        
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Prompt Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="favorite">Favorite</Label>
                        <p className="text-sm text-muted-foreground">
                          Mark this prompt as a favorite for quick access
                        </p>
                      </div>
                      <Switch
                        id="favorite"
                        checked={formData.is_favorite}
                        onCheckedChange={(checked) => handleInputChange('is_favorite', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="template">Template</Label>
                        <p className="text-sm text-muted-foreground">
                          Use this prompt as a template for creating new prompts
                        </p>
                      </div>
                      <Switch
                        id="template"
                        checked={formData.is_template}
                        onCheckedChange={(checked) => handleInputChange('is_template', checked)}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => handleInputChange('version', e.target.value)}
                        placeholder="1.0.0"
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Semantic version for this prompt
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save as Template Confirmation Dialog */}
      {showSaveAsTemplateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Save as Template</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              This will create a new template from the current prompt content.
              Any text in the format <code className="bg-muted px-1 py-0.5 rounded text-xs">{'{{variable}}'}</code> will
              be detected as a variable.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveAsTemplateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmSaveAsTemplate}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

