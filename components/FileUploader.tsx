'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
interface FileUploaderProps {
  onFileSelect: (file: File | null) => void
}
export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('')
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.file.size > 10485760) {
        setError('Le fichier est trop volumineux (max 10 MB)')
      } else {
        setError('Format de fichier non supporté. Utilisez un fichier JSON')
      }
      setSelectedFile(null)
      onFileSelect(null)
      return
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'application/json': ['.json']},
    maxSize: 10485760,
    multiple: false
  })
  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`border-4 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all duration-500 ${
          isDragActive 
            ? 'border-[#7C3AED] bg-[#7C3AED]/10 scale-105 glow-violet' 
            : selectedFile 
            ? 'border-[#06B6D4] bg-[#06B6D4]/10 glow-cyan' 
            : 'border-[#7C3AED]/30 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg 
            className={`w-24 h-24 mb-8 ${selectedFile ? 'text-[#06B6D4]' : 'text-[#7C3AED]'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {selectedFile ? (
            <div>
              <p className="text-2xl font-black text-white mb-3">✓ Fichier sélectionné</p>
              <p className="text-xl text-gray-300 font-bold">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-2 font-mono">({(selectedFile.size / 1024).toFixed(2)} KB)</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-black text-white mb-3">Glissez votre workflow N8N (.json)</p>
              <p className="text-base text-gray-400">ou cliquez pour parcourir vos fichiers</p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-6 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-bold animate-pulse">
          {error}
        </div>
      )}
    </div>
  )
}