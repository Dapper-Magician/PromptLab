import { useState } from 'react'
import { toast } from 'sonner'
import { Settings as SettingsIcon, Palette, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ShortcutManager } from '@/components/ShortcutManager'

export function Settings({ categories, onCategoriesChange }) {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3B82F6' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)

  const handleCreateCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Failed to create category.');
      }

      const createdCategory = await response.json();
      setNewCategory({ name: '', description: '', color: '#3B82F6' });
      setShowNewCategoryDialog(false);
      onCategoriesChange();
      toast.success(`Category "${createdCategory.name}" created.`);

    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Failed to delete category.');
      }

      onCategoriesChange();
      toast.success(`Category "${categoryName}" deleted.`);

    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your PromptLab workspace
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
                <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Category name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Category description..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            id="color"
                            value={newCategory.color}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                            className="w-12 h-10 rounded border border-border"
                          />
                          <Input
                            value={newCategory.color}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No categories yet</p>
                  <p className="text-sm">Create your first category to organize prompts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {category.prompt_count || 0} prompts
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <ShortcutManager />
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <SettingsIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Integration settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <SettingsIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>General settings coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

