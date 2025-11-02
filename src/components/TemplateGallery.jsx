import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus,
  Sparkles,
  FileText,
  Filter,
  Grid3x3,
  List,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function TemplateGallery({ 
  templates = [], 
  categories = [], 
  onCreateNew,
  onEditTemplate,
  onUseTemplate,
  onInstantiateTemplate
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showInstantiateDialog, setShowInstantiateDialog] = useState(false)
  const [variableValues, setVariableValues] = useState({})
  const [promptTitle, setPromptTitle] = useState('')
  const [instantiating, setInstantiating] = useState(false)

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category_id === parseInt(selectedCategory)
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.use_count || 0) - (a.use_count || 0)
      } else if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
    
    // Initialize variable values with defaults
    const initialValues = {}
    template.variables?.forEach(variable => {
      initialValues[variable.name] = variable.default || ''
    })
    setVariableValues(initialValues)
    setPromptTitle(template.name)
    setShowInstantiateDialog(true)
  }

  const handleInstantiate = async () => {
    if (!selectedTemplate) return
    
    setInstantiating(true)
    try {
      await onInstantiateTemplate(selectedTemplate.id, {
        title: promptTitle,
        variables: variableValues
      })
      setShowInstantiateDialog(false)
      setSelectedTemplate(null)
      setVariableValues({})
      setPromptTitle('')
    } catch (error) {
      console.error('Failed to instantiate template:', error)
    } finally {
      setInstantiating(false)
    }
  }

  const getPreviewContent = () => {
    if (!selectedTemplate) return ''
    
    let content = selectedTemplate.content
    selectedTemplate.variables?.forEach(variable => {
      const value = variableValues[variable.name] || variable.default || `{{${variable.name}}}`
      const pattern = new RegExp(`\\{\\{${variable.name}(?:\\|[^}]*)?\\}\\}`, 'g')
      content = content.replace(pattern, value)
    })
    return content
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center">
              <Sparkles className="h-6 w-6 mr-2" />
              Template Gallery
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose from {templates.length} pre-built templates
            </p>
          </div>
          
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-9"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Template Grid/List */}
      <ScrollArea className="flex-1 p-6">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first template to get started'}
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Variable count and category */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {template.variables && template.variables.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {template.variables.length} {template.variables.length === 1 ? 'variable' : 'variables'}
                          </Badge>
                        )}
                        {template.category && (
                          <Badge variant="outline" className="text-xs">
                            <div 
                              className="w-2 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: template.category.color }}
                            />
                            {template.category.name}
                          </Badge>
                        )}
                        {template.use_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Used {template.use_count}x
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                        <Button
                          onClick={() => onEditTemplate(template)}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Instantiate Template Dialog */}
      <Dialog open={showInstantiateDialog} onOpenChange={setShowInstantiateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Fill in the variables to create a new prompt from this template
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {/* Prompt Title */}
              <div>
                <Label htmlFor="prompt-title">Prompt Title *</Label>
                <Input
                  id="prompt-title"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Enter a title for your prompt..."
                  className="mt-1"
                />
              </div>

              {/* Variables */}
              {selectedTemplate?.variables && selectedTemplate.variables.length > 0 && (
                <>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-3">Template Variables</h4>
                    <div className="space-y-3">
                      {selectedTemplate.variables.map((variable) => (
                        <div key={variable.name}>
                          <Label htmlFor={`var-${variable.name}`}>
                            <span className="font-mono text-sm">{variable.name}</span>
                            {variable.description && (
                              <span className="text-xs text-muted-foreground ml-2">
                                - {variable.description}
                              </span>
                            )}
                          </Label>
                          <Input
                            id={`var-${variable.name}`}
                            value={variableValues[variable.name] || ''}
                            onChange={(e) => setVariableValues(prev => ({
                              ...prev,
                              [variable.name]: e.target.value
                            }))}
                            placeholder={variable.default || `Enter ${variable.name}...`}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Label>Preview</Label>
                    <Card className="mt-1">
                      <CardContent className="p-3">
                        <ScrollArea className="h-[200px]">
                          <pre className="text-xs whitespace-pre-wrap font-mono">
                            {getPreviewContent()}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInstantiateDialog(false)}
              disabled={instantiating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInstantiate}
              disabled={instantiating || !promptTitle.trim()}
            >
              {instantiating ? 'Creating...' : 'Create Prompt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}