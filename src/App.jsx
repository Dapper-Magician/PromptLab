import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TestingPanel } from './components/TestingPanel'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PromptList } from './PromptList'
import { PromptEditor } from './PromptEditor'
import { TemplateGallery } from './components/TemplateGallery'
import { TemplateEditor } from './components/TemplateEditor'
import { TestingWorkbench } from './TestingWorkbench'
import { CommandPalette } from './CommandPalette'
import { Analytics } from './Analytics'
import { Settings } from './Settings'
import { Toaster, toast } from 'sonner'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templatesLoading, setTemplatesLoading] = useState(false)

  // API base URL - use relative path for deployed application
  const API_BASE = '/api'

  // Load initial data
  useEffect(() => {
    loadPrompts()
    loadCategories()
    loadTemplates()
  }, [])

  const loadPrompts = async () => {
    try {
      const response = await fetch(`${API_BASE}/prompts`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompts.');
      }
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts:', error);
      toast.error(error.message || 'Could not load prompts.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories.');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error(error.message || 'Could not load categories.');
    }
  };

  const loadTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const response = await fetch(`${API_BASE}/templates`)
      if (!response.ok) {
        throw new Error('Failed to fetch templates.')
      }
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
      toast.error(error.message || 'Could not load templates.')
    } finally {
      setTemplatesLoading(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      // Escape to close command palette
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt)
  }

  const handleNewPrompt = () => {
    // Create a new empty prompt object for the editor
    const newPrompt = {
      id: null,
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
    }
    setSelectedPrompt(newPrompt)
  }

  const handlePromptSave = async (promptData) => {
    const isNew = !promptData.id;
    try {
      const url = isNew
        ? `${API_BASE}/prompts`
        : `${API_BASE}/prompts/${promptData.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Failed to save prompt.');
      }

      const savedPrompt = await response.json();
      
      if (isNew) {
        setPrompts([savedPrompt, ...prompts]);
      } else {
        setPrompts(prompts.map(p => p.id === promptData.id ? savedPrompt : p));
      }
      
      setSelectedPrompt(savedPrompt);
      toast.success(`Prompt "${savedPrompt.title}" saved successfully!`);
      return savedPrompt;

    } catch (error) {
      console.error('Failed to save prompt:', error);
      toast.error(error.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const handlePromptDelete = async (promptId, promptTitle) => {
    try {
      const response = await fetch(`${API_BASE}/prompts/${promptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Failed to delete prompt.');
      }

      setPrompts(prompts.filter(p => p.id !== promptId));
      if (selectedPrompt?.id === promptId) {
        setSelectedPrompt(null);
      }
      toast.success(`Prompt "${promptTitle}" deleted.`);

    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  const handleNewTemplate = () => {
    const newTemplate = {
      id: null,
      name: '',
      content: '',
      description: '',
      category_id: null,
      variables: []
    }
    setSelectedTemplate(newTemplate)
  }

  const handleTemplateSave = async (templateData) => {
    const isNew = !templateData.id
    try {
      const url = isNew
        ? `${API_BASE}/templates`
        : `${API_BASE}/templates/${templateData.id}`
      
      const method = isNew ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }))
        throw new Error(errorData.message || 'Failed to save template.')
      }

      const savedTemplate = await response.json()
      
      if (isNew) {
        setTemplates([savedTemplate, ...templates])
      } else {
        setTemplates(templates.map(t => t.id === templateData.id ? savedTemplate : t))
      }
      
      setSelectedTemplate(null)
      toast.success(`Template "${savedTemplate.name}" saved successfully!`)
      return savedTemplate

    } catch (error) {
      console.error('Failed to save template:', error)
      toast.error(error.message || 'An unexpected error occurred.')
      throw error
    }
  }

  const handleTemplateDelete = async (templateId, templateName) => {
    try {
      const response = await fetch(`${API_BASE}/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }))
        throw new Error(errorData.message || 'Failed to delete template.')
      }

      setTemplates(templates.filter(t => t.id !== templateId))
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null)
      }
      toast.success(`Template "${templateName}" deleted.`)

    } catch (error) {
      console.error('Failed to delete template:', error)
      toast.error(error.message || 'An unexpected error occurred.')
    }
  }

  const handleInstantiateTemplate = async (templateId, data) => {
    try {
      const response = await fetch(`${API_BASE}/templates/${templateId}/instantiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }))
        throw new Error(errorData.message || 'Failed to create prompt from template.')
      }

      const newPrompt = await response.json()
      setPrompts([newPrompt, ...prompts])
      setSelectedPrompt(newPrompt)
      toast.success(`Prompt "${newPrompt.title}" created from template!`)
      
      // Reload templates to update use count
      loadTemplates()
      
      return newPrompt

    } catch (error) {
      console.error('Failed to instantiate template:', error)
      toast.error(error.message || 'An unexpected error occurred.')
      throw error
    }
  }

  const handleSaveAsTemplate = async (templateData) => {
    try {
      const response = await fetch(`${API_BASE}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }))
        throw new Error(errorData.message || 'Failed to save as template.')
      }

      const savedTemplate = await response.json()
      setTemplates([savedTemplate, ...templates])
      toast.success(`Template "${savedTemplate.name}" created successfully!`)
      
      return savedTemplate

    } catch (error) {
      console.error('Failed to save as template:', error)
      toast.error(error.message || 'An unexpected error occurred.')
      throw error
    }
  }

  return (
    <Router>
      <Layout>
        {/* Sidebar Panel */}
        <Layout.Sidebar isCollapsed={!sidebarOpen}>
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            prompts={prompts}
            categories={categories}
            onPromptSelect={handlePromptSelect}
            selectedPrompt={selectedPrompt}
          />
        </Layout.Sidebar>

        {/* Main Content Panel */}
        <Layout.Main>
          {/* Header */}
          <Header
            onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex h-full">
                    <div className="w-1/3 border-r border-[var(--border-primary)]">
                      <PromptList
                        prompts={prompts}
                        categories={categories}
                        onPromptSelect={handlePromptSelect}
                        onNewPrompt={handleNewPrompt}
                        onPromptDelete={handlePromptDelete}
                        selectedPrompt={selectedPrompt}
                        loading={loading}
                      />
                    </div>
                    <div className="flex-1">
                      <PromptEditor
                        prompt={selectedPrompt}
                        categories={categories}
                        onSave={handlePromptSave}
                        onClose={() => setSelectedPrompt(null)}
                        onSaveAsTemplate={handleSaveAsTemplate}
                      />
                    </div>
                  </div>
                }
              />
              <Route
                path="/templates"
                element={
                  selectedTemplate ? (
                    <TemplateEditor
                      template={selectedTemplate}
                      categories={categories}
                      onSave={handleTemplateSave}
                      onClose={() => setSelectedTemplate(null)}
                    />
                  ) : (
                    <TemplateGallery
                      templates={templates}
                      categories={categories}
                      onCreateNew={handleNewTemplate}
                      onEditTemplate={setSelectedTemplate}
                      onInstantiateTemplate={handleInstantiateTemplate}
                    />
                  )
                }
              />
              <Route
                path="/testing"
                element={
                  <TestingWorkbench
                    prompts={prompts}
                    onPromptSelect={handlePromptSelect}
                  />
                }
              />
              <Route
                path="/analytics"
                element={
                  <Analytics
                    prompts={prompts}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    categories={categories}
                    onCategoriesChange={loadCategories}
                  />
                }
              />
            </Routes>
          </div>
        </Layout.Main>

        {/* Testing Panel (Right Side) */}
        <Layout.Panel isVisible={true}>
          <TestingPanel />
        </Layout.Panel>

        {/* Command Palette */}
        <CommandPalette
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          prompts={prompts}
          onPromptSelect={handlePromptSelect}
        />
        <Toaster />
      </Layout>
    </Router>
  )
}

export default App

