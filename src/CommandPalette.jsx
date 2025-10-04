import { useState, useEffect } from 'react'
import { Search, FileText, Star, Folder, Command } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export function CommandPalette({ open, onClose, prompts, onPromptSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter prompts based on search
  const filteredPrompts = prompts.filter(prompt => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      prompt.title.toLowerCase().includes(searchLower) ||
      prompt.content.toLowerCase().includes(searchLower) ||
      prompt.description?.toLowerCase().includes(searchLower) ||
      (prompt.tags && prompt.tags.some(tag => 
        tag.toLowerCase().includes(searchLower)
      ))
    )
  }).slice(0, 10) // Limit to 10 results

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm('')
      setSelectedIndex(0)
    }
  }, [open])

  // Update selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredPrompts.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredPrompts.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredPrompts[selectedIndex]) {
            handleSelectPrompt(filteredPrompts[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredPrompts, selectedIndex, onClose])

  const handleSelectPrompt = (prompt) => {
    onPromptSelect(prompt)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <Command className="h-5 w-5" />
            <span>Command Palette</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="max-h-96 px-6 pb-6">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {searchTerm ? 'No prompts found' : 'Start typing to search prompts'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 mt-4">
              {filteredPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleSelectPrompt(prompt)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{prompt.title}</span>
                        {prompt.is_favorite && (
                          <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        )}
                        {prompt.is_template && (
                          <Badge variant="secondary" className="text-xs">
                            Template
                          </Badge>
                        )}
                      </div>
                      
                      {prompt.description && (
                        <p className="text-sm text-muted-foreground truncate mb-1">
                          {prompt.description}
                        </p>
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
                              <span>+{prompt.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground ml-2">
                      {index === selectedIndex && '↵'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="px-6 py-3 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filteredPrompts.length > 0 && `${filteredPrompts.length} result${filteredPrompts.length !== 1 ? 's' : ''}`}
            </span>
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

