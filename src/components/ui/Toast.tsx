'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useModalStore } from '@/store/useModalStore'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function Toast({ message, type }: ToastProps) {
  const { hideToast } = useModalStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast()
    }, 3000)

    return () => clearTimeout(timer)
  }, [hideToast])

  const bgColor = {
    success: 'bg-green-900/80 border-green-500/30',
    error: 'bg-red-900/80 border-red-500/30',
    info: 'bg-blue-900/80 border-blue-500/30'
  }

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`glass ${bgColor[type]} rounded-lg px-4 py-3 flex items-center gap-3 min-w-64`}
    >
      <span className="text-lg">{icon[type]}</span>
      <span className="text-sm text-white">{message}</span>
      <button
        onClick={hideToast}
        className="ml-auto text-slate-400 hover:text-white"
      >
        ×
      </button>
    </motion.div>
  )
}
