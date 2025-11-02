import { useState } from 'react'
import {
  FileText,
  Star,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

export function PromptList({ 
  prompts, 
  categories, 
  onPromptSelect, 
  onNewPrompt,
  onPromptDelete, 
  selectedPrompt, 
  loading 
}) {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString()
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const handlePromptAction = (action, prompt, e) => {
    e.stopPropagation()
    
    switch (action) {
      case 'edit':
        onPromptSelect(prompt)
        break
      case 'duplicate':
        // TODO: Implement duplicate functionality
        console.log('Duplicate prompt:', prompt.id)
        break
      case 'delete':
        if (window.confirm('Are you sure you want to delete this prompt?')) {
          onPromptDelete(prompt.id, prompt.title)
        }
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Prompts</h2>
            <p className="text-muted-foreground">
              {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} total
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewPrompt}
            >
              <FileText className="h-4 w-4 mr-2" />
              New Prompt
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {prompts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No prompts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first prompt to get started with PromptLab
              </p>
              <Button onClick={onNewPrompt}>
                <FileText className="h-4 w-4 mr-2" />
                Create First Prompt
              </Button>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              <AnimatePresence mode="popLayout">
                {prompts.map((prompt, index) => {
                  const category = getCategoryById(prompt.category_id)
                  const isSelected = selectedPrompt?.id === prompt.id
                  
                  return (
                    <motion.div
                      key={prompt.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: index * 0.02
                      }}
                    >
                      <Card
                        clickable
                        selected={isSelected}
                        onClick={() => onPromptSelect(prompt)}
                      >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold truncate">{prompt.title}</h3>
                            {prompt.is_favorite && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                            {prompt.is_template && (
                              <Badge variant="secondary" className="text-xs">
                                Template
                              </Badge>
                            )}
                          </div>
                          
                          {prompt.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {prompt.description}
                            </p>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => handlePromptAction('edit', prompt, e)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => handlePromptAction('duplicate', prompt, e)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => handlePromptAction('delete', prompt, e)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Content Preview */}
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground line-clamp-3 font-mono bg-muted/50 p-2 rounded">
                          {prompt.content}
                        </p>
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {category && (
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          )}
                          
                          {prompt.author && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{prompt.author}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(prompt.updated_at)}</span>
                          </div>
                          
                          {prompt.use_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{prompt.use_count} uses</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span>v{prompt.version}</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {prompt.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

