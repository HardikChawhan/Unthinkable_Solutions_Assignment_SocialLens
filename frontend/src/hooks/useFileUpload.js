import { useState, useCallback } from 'react'
import { uploadFile } from '../services/api'

/**
 * Hook for managing file upload state and progress
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedText, setExtractedText] = useState(null)
  const [fileMetadata, setFileMetadata] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  const upload = useCallback(async (file) => {
    if (!file) return null

    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)
    setExtractedText(null)
    setFileMetadata(null)

    try {
      const result = await uploadFile(file, (percent) => {
        setUploadProgress(percent)
      })

      // api.js now returns the unwrapped data: { extractedText, metadata, fileInfo }
      setExtractedText(result.extractedText || result.text || '')
      setFileMetadata({
        filename: file.name,
        size: file.size,
        type: file.type,
        ...result.metadata,
        ...result.fileInfo,
      })

      setUploadProgress(100)
      return result
    } catch (error) {
      const message =
        error.message || 'Failed to upload file. Please try again.'
      setUploadError(message)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(0)
    setExtractedText(null)
    setFileMetadata(null)
    setUploadError(null)
  }, [])

  return {
    upload,
    uploadProgress,
    extractedText,
    fileMetadata,
    isUploading,
    uploadError,
    reset,
  }
}

export default useFileUpload
