import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { cn } from '@/lib/cn'

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

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <AnimatePresence mode="wait">
            {open && (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-[var(--text-primary)]"
              >
                Prompts
              </motion.h2>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 flex-shrink-0"
            title={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search - Only show when expanded */}
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Access - Favorites (only when expanded) */}
      <AnimatePresence mode="wait">
        {open && favoritePrompts.length > 0 && !showFavorites && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[var(--border-primary)]"
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1 text-[var(--text-secondary)]" />
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
                      <div className="text-xs text-[var(--text-tertiary)] truncate">
                        {prompt.description || 'No description'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories (only when expanded) */}
      <AnimatePresence mode="wait">
        {open && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[var(--border-primary)]"
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center">
                <Folder className="h-4 w-4 mr-1 text-[var(--text-secondary)]" />
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {open ? (
          // Expanded view - Full list
          <>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  All Prompts ({filteredPrompts.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPromptSelect(null)}
                  className="h-6 w-6 p-0"
                  title="New prompt"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="space-y-2 pb-4"
              >
                {filteredPrompts.map(prompt => (
                  <Button
                    key={prompt.id}
                    variant={selectedPrompt?.id === prompt.id ? "secondary" : "ghost"}
                    onClick={() => onPromptSelect(prompt)}
                    className="w-full justify-start text-left h-auto p-3 relative"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="h-4 w-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="font-medium truncate">{prompt.title}</span>
                        {prompt.is_favorite && (
                          <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      {prompt.description && (
                        <div className="text-xs text-[var(--text-tertiary)] truncate mb-1">
                          {prompt.description}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-xs text-[var(--text-tertiary)]">
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
                  <div className="text-center py-8 text-[var(--text-tertiary)]">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No prompts found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                )}
              </motion.div>
            </ScrollArea>
          </>
        ) : (
          // Collapsed view - Just icons
          <div className="flex-1 flex flex-col items-center py-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPromptSelect(null)}
              className="h-10 w-10 p-0"
              title="New prompt"
            >
              <Plus className="h-5 w-5" />
            </Button>
            
            <Separator className="w-8" />
            
            {favoritePrompts.slice(0, 3).map(prompt => (
              <Button
                key={prompt.id}
                variant={selectedPrompt?.id === prompt.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onPromptSelect(prompt)}
                className="h-10 w-10 p-0"
                title={prompt.title}
              >
                <FileText className="h-5 w-5" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

