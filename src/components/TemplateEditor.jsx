import { useState, useEffect } from 'react'
import { 
  Save, 
  X, 
  Eye, 
  FileText,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TemplateEditor({ template, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    description: '',
    category_id: null,
    variables: []
  })
  const [previewValues, setPreviewValues] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Extract variables from content
  const extractVariables = (content) => {
    const pattern = /\{\{([^}|]+)(?:\|([^}]*))?\}\}/g
    const matches = [...content.matchAll(pattern)]
    const seen = new Set()
    const variables = []
    
    matches.forEach(match => {
      const varName = match[1].trim()
      const defaultValue = match[2] ? match[2].trim() : ''
      
      if (!seen.has(varName)) {
        // Keep existing variable data if it exists
        const existing = formData.variables.find(v => v.name === varName)
        variables.push({
          name: varName,
          description: existing?.description || '',
          default: existing?.default || defaultValue
        })
        seen.add(varName)
      }
    })
    
    return variables
  }

  // Initialize form data when template changes
  useEffect(() => {
    if (template) {
      setFormData({
        ...template,
        variables: template.variables || []
      })
      
      // Initialize preview values with defaults
      const previewVals = {}
      template.variables?.forEach(v => {
        previewVals[v.name] = v.default || ''
      })
      setPreviewValues(previewVals)
      setIsDirty(false)
    } else {
      setFormData({
        name: '',
        content: '',
        description: '',
        category_id: null,
        variables: []
      })
      setPreviewValues({})
      setIsDirty(false)
    }
  }, [template])

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Auto-detect variables when content changes
      if (field === 'content') {
        const detectedVars = extractVariables(value)
        updated.variables = detectedVars
        
        // Update preview values for new variables
        const newPreviewValues = { ...previewValues }
        detectedVars.forEach(v => {
          if (!(v.name in newPreviewValues)) {
            newPreviewValues[v.name] = v.default || ''
          }
        })
        setPreviewValues(newPreviewValues)
      }
      
      return updated
    })
    setIsDirty(true)
  }

  const handleVariableChange = (index, field, value) => {
    const updatedVars = [...formData.variables]
    updatedVars[index] = {
      ...updatedVars[index],
      [field]: value
    }
    handleInputChange('variables', updatedVars)
  }

  const handlePreviewValueChange = (varName, value) => {
    setPreviewValues(prev => ({
      ...prev,
      [varName]: value
    }))
  }

  const getPreviewContent = () => {
    let content = formData.content
    formData.variables.forEach(variable => {
      const value = previewValues[variable.name] || variable.default || `{{${variable.name}}}`
      const pattern = new RegExp(`\\{\\{${variable.name}(?:\\|[^}]*)?\\}\\}`, 'g')
      content = content.replace(pattern, value)
    })
    return content
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Name and content are required')
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to save template:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!template && formData.name === '' && formData.content === '') {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <div className="text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No template selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a template from the gallery or create a new one
          </p>
          <Button onClick={() => handleInputChange('name', 'New Template')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
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
                {template ? 'Edit Template' : 'New Template'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {template ? `Last updated ${new Date(template.updated_at).toLocaleDateString()}` : 'Create a new template'}
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
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <FileText className="h-4 w-4 mr-2" />
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
            <TabsTrigger value="variables">
              Variables
              {formData.variables.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {formData.variables.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 overflow-hidden mt-4">
            <div className="h-full px-6 pb-6">
              <div className="grid grid-cols-1 gap-4 h-full">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter template name..."
                    className="mt-1"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="content">Template Content *</Label>
                    <span className="text-xs text-muted-foreground">
                      Use {`{{variable}}`} syntax for variables
                    </span>
                  </div>
                  {showPreview ? (
                    <Card className="flex-1 mt-1">
                      <CardContent className="p-4">
                        <ScrollArea className="h-full">
                          <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                              {getPreviewContent()}
                            </pre>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ) : (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Enter your template content here... Use {{variable_name}} for variables."
                      className="flex-1 mt-1 resize-none font-mono"
                    />
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of what this template is for..."
                    className="mt-1 h-20 resize-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variables" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-6">
                {formData.variables.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        No variables detected. Use {`{{variable_name}}`} syntax in your template content.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Detected Variables</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {formData.variables.map((variable, index) => (
                          <Card key={variable.name} className="border-2">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-mono">
                                  {`{{${variable.name}}}`}
                                </Badge>
                              </div>
                              
                              <div>
                                <Label htmlFor={`var-desc-${index}`}>Description</Label>
                                <Input
                                  id={`var-desc-${index}`}
                                  value={variable.description}
                                  onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
                                  placeholder="What is this variable for?"
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`var-default-${index}`}>Default Value</Label>
                                <Input
                                  id={`var-default-${index}`}
                                  value={variable.default}
                                  onChange={(e) => handleVariableChange(index, 'default', e.target.value)}
                                  placeholder="Optional default value"
                                  className="mt-1"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Preview with Sample Values</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {formData.variables.map((variable) => (
                          <div key={variable.name}>
                            <Label htmlFor={`preview-${variable.name}`}>
                              {variable.name}
                              {variable.description && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({variable.description})
                                </span>
                              )}
                            </Label>
                            <Input
                              id={`preview-${variable.name}`}
                              value={previewValues[variable.name] || ''}
                              onChange={(e) => handlePreviewValueChange(variable.name, e.target.value)}
                              placeholder={variable.default || `Enter ${variable.name}...`}
                              className="mt-1"
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Template Settings</CardTitle>
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

                    {template && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label>Usage Statistics</Label>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Used {template.use_count || 0} times</p>
                            <p>Created {new Date(template.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}