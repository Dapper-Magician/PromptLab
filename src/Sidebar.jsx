import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Folder, 
  FileText, 
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function Sidebar({ 
  open, 
  onToggle, 
  prompts, 
  categories, 
  onPromptSelect, 
  selectedPrompt 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)

  // Filter prompts based on search and filters
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = !searchTerm || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.tags && prompt.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    
    const matchesCategory = !selectedCategory || prompt.category_id === selectedCategory
    const matchesFavorites = !showFavorites || prompt.is_favorite
    
    return matchesSearch && matchesCategory && matchesFavorites
  })

  // Get favorite prompts for quick access
  const favoritePrompts = prompts.filter(p => p.is_favorite).slice(0, 5)

  if (!open) {
    return (
      <div className="w-12 border-r border-border bg-sidebar flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 border-r border-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Prompts</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Button
            variant={showFavorites ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center space-x-1"
          >
            <Star className="h-3 w-3" />
            <span>Favorites</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Filter className="h-3 w-3" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Quick Access - Favorites */}
      {favoritePrompts.length > 0 && !showFavorites && (
        <div className="p-4 border-b border-sidebar-border">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-2 flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Quick Access
          </h3>
          <div className="space-y-1">
            {favoritePrompts.map(prompt => (
              <Button
                key={prompt.id}
                variant="ghost"
                size="sm"
                onClick={() => onPromptSelect(prompt)}
                className="w-full justify-start text-left h-auto p-2"
              >
                <div className="truncate">
                  <div className="text-sm font-medium truncate">{prompt.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {prompt.description || 'No description'}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="p-4 border-b border-sidebar-border">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-2 flex items-center">
            <Folder className="h-4 w-4 mr-1" />
            Categories
          </h3>
          <div className="space-y-1">
            <Button
              variant={selectedCategory === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="w-full justify-start"
            >
              All Categories
              <Badge variant="secondary" className="ml-auto">
                {prompts.length}
              </Badge>
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="w-full justify-start"
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                <Badge variant="secondary" className="ml-auto">
                  {category.prompt_count || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt List */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-sidebar-foreground">
              All Prompts ({filteredPrompts.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPromptSelect(null)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {filteredPrompts.map(prompt => (
              <Button
                key={prompt.id}
                variant={selectedPrompt?.id === prompt.id ? "secondary" : "ghost"}
                onClick={() => onPromptSelect(prompt)}
                className="w-full justify-start text-left h-auto p-3 relative"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium truncate">{prompt.title}</span>
                    {prompt.is_favorite && (
                      <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  {prompt.description && (
                    <div className="text-xs text-muted-foreground truncate mb-1">
                      {prompt.description}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {prompt.category && (
                      <span className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-1" 
                          style={{ backgroundColor: prompt.category.color }}
                        />
                        {prompt.category.name}
                      </span>
                    )}
                    
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {prompt.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 2 && (
                          <span className="text-xs">+{prompt.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
            
            {filteredPrompts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No prompts found</p>
                <p className="text-xs">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

