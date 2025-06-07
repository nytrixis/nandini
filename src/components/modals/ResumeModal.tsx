'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModalStore } from '@/store/useModalStore'

export default function ResumeModal() {
  const { closeModal } = useModalStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Simulate loading time for PDF
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal('resume')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Nandini_Pandey_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleResetZoom = () => {
    setScale(1)
  }

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.print()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[100] flex flex-col"
      >
        {/* Header Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm"
        >
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer group"
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:text-violet-400 transition-colors">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>

            <div className="h-6 w-px bg-slate-700"></div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                  <path d="M8 11h6"/>
                </svg>
              </button>

              <span className="text-slate-400 text-sm orbitron min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom In"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                  <path d="M11 8v6"/>
                  <path d="M8 11h6"/>
                </svg>
              </button>

              <button
                onClick={handleResetZoom}
                className="px-3 py-1 rounded-lg glass hover:bg-slate-700/50 text-xs text-slate-400 hover:text-violet-400 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Center Title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h2 className="text-lg orbitron text-slate-200">Resume - Nandini Pandey</h2>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-slate-700/50 transition-colors cursor-pointer"
              title="Print"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span className="text-slate-400 text-sm">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
              title="Download"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              <span className="text-white text-sm orbitron">Download</span>
            </button>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        <div className="flex-1 relative bg-slate-900">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10"
              >
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 border-3 border-violet-400 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="text-violet-400 text-lg orbitron mb-2">Loading Resume...</div>
                  <div className="text-slate-400 text-sm">Please wait while we prepare your document</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center glass rounded-xl p-8 max-w-md">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl orbitron text-red-400 mb-2">Error Loading PDF</h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-white orbitron transition-colors cursor-pointer"
                >
                  Download Instead
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center p-4 overflow-auto"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
              }}
            >
              <iframe
                id="pdf-iframe"
                src="/resume.pdf#toolbar=1&navpanes=0&scrollbar=1"
                className="w-full h-full border-none rounded-lg shadow-2xl"
                title="Resume - Nandini Pandey"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError('Failed to load PDF. Please try downloading the file instead.')
                  setIsLoading(false)
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center justify-between p-3 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>📄 PDF Document</span>
            <span>•</span>
            <span>Secure View</span>
            <span>•</span>
            <span>nytrixis.dos viewer</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Use Ctrl+Scroll to zoom</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
