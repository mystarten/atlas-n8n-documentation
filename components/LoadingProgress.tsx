'use client'
import { useEffect, useState } from 'react'
export default function LoadingProgress() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Analyse du template...')
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.67
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        if (newProgress > 20 && newProgress <= 40) {
          setMessage('Génération de la documentation...')
        } else if (newProgress > 40) {
          setMessage('Finalisation...')
        }
        return newProgress
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-16 shadow-lg shadow-black/10">
      <div className="flex flex-col items-center">
        <div className="relative mb-10">
          <div className="w-32 h-32 border-8 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/logo.png" alt="ATLAS Logo" className="h-20 w-20 object-contain animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-8">{message}</h2>
        <div className="w-full max-w-md mb-8">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <p className="text-gray-300 font-bold text-xl">Temps estimé : ~1 minute</p>
        <p className="text-sm text-gray-500 mt-3">Votre template est en cours de traitement...</p>
      </div>
    </div>
  )
}