import { useState, useEffect, useMemo } from 'react'
import { 
  Search, FileText, Star, Folder, Command, Plus, Settings, 
  BarChart3, Sparkles, Clock, TrendingUp, Zap, ArrowUp, ArrowDown, CornerDownLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Detect OS for keyboard shortcuts
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

// Fuzzy search function with scoring
function fuzzySearch(searchTerm, items) {
  if (!searchTerm) return items.map((item, index) => ({ item, score: 0, matches: [], index }))
  
  const searchLower = searchTerm.toLowerCase()
  const results = []
  
  items.forEach((item, index) => {
    let score = 0
    const matches = []
    
    // Search in title (highest weight)
    if (item.title) {
      const titleLower = item.title.toLowerCase()
      if (titleLower.includes(searchLower)) {
        score += 10
        matches.push({ field: 'title', text: item.title })
      }
    }
    
    // Search in description (medium weight)
    if (item.description) {
      const descLower = item.description.toLowerCase()
      if (descLower.includes(searchLower)) {
        score += 5
        matches.push({ field: 'description', text: item.description })
      }
    }
    
    // Search in content (lower weight)
    if (item.content) {
      const contentLower = item.content.toLowerCase()
      if (contentLower.includes(searchLower)) {
        score += 3
        matches.push({ field: 'content', text: item.content })
      }
    }
    
    // Search in tags (medium weight)
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchLower)) {
          score += 4
          matches.push({ field: 'tag', text: tag })
        }
      })
    }
    
    // Search in category (lower weight)
    if (item.category?.name) {
      if (item.category.name.toLowerCase().includes(searchLower)) {
        score += 2
        matches.push({ field: 'category', text: item.category.name })
      }
    }
    
    // Boost for favorites and templates
    if (item.is_favorite) score += 1
    if (item.is_template) score += 1
    
    if (score > 0) {
      results.push({ item, score, matches, index })
    }
  })
  
  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score)
}

// Highlight matched text
function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
  return parts.map((part, i) => 
    part.toLowerCase() === searchTerm.toLowerCase() 
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground">{part}</mark>
      : part
  )
}

// Format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return 'Never'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function CommandPalette({ open, onClose, prompts, onPromptSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  // Quick actions that appear at the top
  const quickActions = [
    {
      id: 'new-prompt',
      icon: Plus,
      label: 'Create new prompt',
      shortcut: isMac ? '⌘N' : 'Ctrl+N',
      action: () => {
        onClose()
        // Navigate to editor with new prompt
        window.location.href = '/'
      }
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Open settings',
      shortcut: isMac ? '⌘,' : 'Ctrl+,',
      action: () => {
        onClose()
        window.location.href = '/settings'
      }
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'View analytics',
      shortcut: isMac ? '⌘A' : 'Ctrl+A',
      action: () => {
        onClose()
        window.location.href = '/analytics'
      }
    }
  ]

  // Fuzzy search with scoring and highlighting
  const searchResults = useMemo(() => {
    setIsSearching(true)
    const results = fuzzySearch(searchTerm, prompts)
    // Simulate slight delay for smooth UX (still under 100ms)
    setTimeout(() => setIsSearching(false), 50)
    return results.slice(0, 10) // Limit to top 10 results
  }, [searchTerm, prompts])

  // Get recent and favorite prompts
  const recentPrompts = useMemo(() => {
    return [...prompts]
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
      .slice(0, 5)
  }, [prompts])

  const favoritePrompts = useMemo(() => {
    return prompts.filter(p => p.is_favorite).slice(0, 5)
  }, [prompts])

  // Combined items: quick actions + search results (or recent/favorites)
  const allItems = useMemo(() => {
    const items = [...quickActions]
    
    if (searchTerm) {
      // Show search results
      items.push(...searchResults.map(r => ({ ...r.item, type: 'prompt', searchData: r })))
    } else {
      // Show recent and favorites
      if (favoritePrompts.length > 0) {
        items.push({ type: 'section', label: 'Favorites' })
        items.push(...favoritePrompts.map(p => ({ ...p, type: 'prompt' })))
      }
      if (recentPrompts.length > 0) {
        items.push({ type: 'section', label: 'Recent' })
        items.push(...recentPrompts.map(p => ({ ...p, type: 'prompt' })))
      }
    }
    
    return items
  }, [quickActions, searchTerm, searchResults, recentPrompts, favoritePrompts])

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm('')
      setSelectedIndex(0)
    }
  }, [open])

  // Update selected index when items change
  useEffect(() => {
    // Skip sections when setting selected index
    const validIndex = allItems.findIndex(item => item.type !== 'section')
    setSelectedIndex(validIndex >= 0 ? validIndex : 0)
  }, [allItems])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => {
            // Find next valid (non-section) item
            let next = prev + 1
            while (next < allItems.length && allItems[next].type === 'section') {
              next++
            }
            return next < allItems.length ? next : prev
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => {
            // Find previous valid (non-section) item
            let next = prev - 1
            while (next >= 0 && allItems[next].type === 'section') {
              next--
            }
            return next >= 0 ? next : prev
          })
          break
        case 'Enter':
          e.preventDefault()
          handleSelectItem(allItems[selectedIndex])
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, allItems, selectedIndex, onClose])

  const handleSelectItem = (item) => {
    if (!item || item.type === 'section') return

    if (item.action) {
      // Quick action
      item.action()
    } else if (item.type === 'prompt') {
      // Prompt selection
      onPromptSelect(item)
      onClose()
    }
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const dialogVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        duration: 0.3,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            <DialogOverlay asChild>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
            </DialogOverlay>
            
            <DialogContent 
              asChild
              className="fixed left-[50%] top-[30%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-30%] border border-border bg-background p-0 shadow-2xl sm:rounded-lg overflow-hidden"
            >
              <motion.div
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Search Header */}
                <div className="border-b border-border bg-muted/30 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-16 h-12 text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        {isMac ? '⌘' : 'Ctrl'}K
                      </kbd>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <ScrollArea className="max-h-[60vh]">
                  {isSearching ? (
                    // Loading skeleton
                    <div className="p-4 space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3">
                          <Skeleton className="h-10 w-10 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : allItems.length === 0 || (allItems.length === quickActions.length && searchTerm) ? (
                    // Empty state
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 px-4"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {searchTerm ? 'No prompts found' : 'No prompts yet'}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {searchTerm ? 'Try a different search term' : 'Create your first prompt to get started'}
                      </p>
                    </motion.div>
                  ) : (
                    // Results list
                    <motion.div
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-2"
                    >
                      {allItems.map((item, index) => {
                        if (item.type === 'section') {
                          return (
                            <motion.div
                              key={`section-${item.label}`}
                              variants={itemVariants}
                              className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                            >
                              {item.label}
                            </motion.div>
                          )
                        }

                        const isSelected = index === selectedIndex
                        const Icon = item.icon || FileText

                        return (
                          <motion.div
                            key={item.id || `prompt-${index}`}
                            variants={itemVariants}
                            className={`
                              group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
                              ${isSelected 
                                ? 'bg-accent text-accent-foreground' 
                                : 'hover:bg-accent/50'
                              }
                            `}
                            onClick={() => handleSelectItem(item)}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            {/* Icon */}
                            <div className={`
                              flex items-center justify-center w-10 h-10 rounded-lg shrink-0
                              ${isSelected ? 'bg-primary/10' : 'bg-muted/50'}
                            `}>
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium truncate">
                                  {item.action 
                                    ? item.label 
                                    : highlightText(item.title, searchTerm)
                                  }
                                </span>
                                {item.is_favorite && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                                )}
                                {item.is_template && (
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                    Template
                                  </Badge>
                                )}
                              </div>
                              
                              {item.description && (
                                <p className="text-sm text-muted-foreground truncate mb-1">
                                  {highlightText(item.description, searchTerm)}
                                </p>
                              )}
                              
                              {/* Metadata row */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {item.category && (
                                  <span className="flex items-center gap-1">
                                    <div 
                                      className="w-2 h-2 rounded-full" 
                                      style={{ backgroundColor: item.category.color || '#888' }}
                                    />
                                    {item.category.name}
                                  </span>
                                )}
                                
                                {item.updated_at && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatRelativeTime(item.updated_at)}
                                  </span>
                                )}
                                
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {item.tags.slice(0, 2).map(tag => (
                                      <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                        {highlightText(tag, searchTerm)}
                                      </Badge>
                                    ))}
                                    {item.tags.length > 2 && (
                                      <span className="text-[10px]">+{item.tags.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Keyboard hint or shortcut */}
                            <div className="flex items-center gap-1 shrink-0">
                              {item.shortcut ? (
                                <kbd className="hidden group-hover:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
                                  {item.shortcut}
                                </kbd>
                              ) : isSelected ? (
                                <CornerDownLeft className="h-4 w-4 text-muted-foreground" />
                              ) : null}
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </ScrollArea>

                {/* Footer with keyboard hints */}
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {allItems.filter(i => i.type !== 'section').length > 0 && (
                        <span className="flex items-center gap-2">
                          {searchTerm ? (
                            <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                          ) : null}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <kbd className="flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                          <ArrowUp className="h-3 w-3" />
                        </kbd>
                        <kbd className="flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                          <ArrowDown className="h-3 w-3" />
                        </kbd>
                        <span className="text-[10px]">Navigate</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <kbd className="flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                          <CornerDownLeft className="h-3 w-3" />
                        </kbd>
                        <span className="text-[10px]">Select</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <kbd className="flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                          Esc
                        </kbd>
                        <span className="text-[10px]">Close</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
