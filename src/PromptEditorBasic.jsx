import React from 'react'
import { Button } from '@/components/ui/button'

export function PromptEditorBasic({ prompt, categories, onSave, onClose }) {
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    description: '',
    category_id: '',
    is_favorite: false
  })
  const [saving, setSaving] = React.useState(false)

  // Initialize form data
  React.useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        content: prompt.content || '',
        description: prompt.description || '',
        category_id: prompt.category_id || '',
        is_favorite: prompt.is_favorite || false
      })
    } else {
      // New prompt - initialize with empty values
      setFormData({
        title: '',
        content: '',
        description: '',
        category_id: '',
        is_favorite: false
      })
    }
  }, [prompt])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required')
      return
    }

    setSaving(true)
    try {
      const promptData = {
        id: prompt?.id || null,
        title: formData.title.trim(),
        content: formData.content.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id || null,
        is_favorite: formData.is_favorite,
        is_template: false,
        tags: [],
        author: '',
        source: '',
        version: '1.0.0'
      }

      await onSave(promptData)
    } catch (error) {
      console.error('Failed to save prompt:', error)
      alert('Failed to save prompt. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Show placeholder when no prompt is selected and form is empty
  if (!prompt && !formData.title && !formData.content) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        backgroundColor: '#f8f9fa',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No prompt selected
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Select a prompt from the list or create a new one
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              {prompt?.id ? 'Edit Prompt' : 'New Prompt'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
              {prompt?.id ? 'Edit your existing prompt' : 'Create a new prompt'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={handleSave}
              disabled={saving || !formData.title.trim() || !formData.content.trim()}
              style={{ 
                backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>

            {onClose && (
              <Button
                onClick={onClose}
                style={{ 
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '1.5rem',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter prompt title..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter your prompt content here..."
              rows={10}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                minHeight: '200px',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of what this prompt does..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">No category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="favorite"
                checked={formData.is_favorite}
                onChange={(e) => handleInputChange('is_favorite', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="favorite" style={{ fontSize: '0.875rem', color: '#374151' }}>
                Mark as favorite
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

