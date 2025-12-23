'use client'

import { useState, useRef } from 'react'

export default function ImageUpload({ value, onChange, label = "Upload Image", accept = "image/*", type = "general" }) {
  const [preview, setPreview] = useState(value || null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return false
    }

    // Check file size (max 10MB before compression)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      return false
    }

    setError(null)
    return true
  }

  const handleFileChange = async (file) => {
    if (!file || !validateFile(file)) return

    // Convert file to base64
    const reader = new FileReader()
    
    reader.onloadend = async () => {
      const base64String = reader.result
      setPreview(base64String)

      // Upload to Cloudinary
      setUploading(true)
      setError(null)

      try {
        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            folder: type, // Use type as folder (leaders, events, blogs, gallery, etc.)
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()
        
        if (data.success && data.data?.url) {
          onChange(data.data.url)
        } else {
          throw new Error(data.error || 'Upload failed')
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError(err.message || 'Failed to upload image. Please try again.')
        setPreview(value || null) // Revert to original
      } finally {
        setUploading(false)
      }
    }

    reader.onerror = () => {
      setError('Failed to read file')
    }

    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative mb-4 group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-neutral-800"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <i className="fas fa-trash mr-2"></i>
              Remove Image
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
            : 'border-gray-300 dark:border-neutral-700 hover:border-purple-400 dark:hover:border-purple-600 bg-gray-50 dark:bg-neutral-900'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        <div className="space-y-3">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <div className="text-gray-400 dark:text-gray-500">
                <i className="fas fa-cloud-upload-alt text-4xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB (stored on Cloudinary)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-start space-x-2">
          <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Help Text */}
      {!error && !uploading && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Recommended: 1200x600px for best results
        </p>
      )}
    </div>
  )
}
