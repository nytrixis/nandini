'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface WebBrowserProps {
  url: string
  onClose: () => void
}

export default function WebBrowser({ url, onClose }: WebBrowserProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState(url)
  const [iframeError, setIframeError] = useState(false)
  const [shouldOpenInNewTab, setShouldOpenInNewTab] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('WebBrowser component loaded with URL:', url)
    setCurrentUrl(url)
    
    // Check if this is a site that typically blocks iframes
    const blockedSites = ['github.com', 'linkedin.com', 'facebook.com', 'twitter.com', 'instagram.com']
    const domain = getDomain(url)
    
    if (blockedSites.some(site => domain.includes(site))) {
      setShouldOpenInNewTab(true)
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [url])

  const handleBack = () => {
    console.log('Back button clicked')
    router.push('/')
  }

  const handleClose = () => {
    console.log('Close button clicked')
    onClose()
  }

  const handleRefresh = () => {
    console.log('Refresh button clicked')
    setIsLoading(true)
    setIframeError(false)
    setShouldOpenInNewTab(false)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const handleOpenInNewTab = () => {
    window.open(currentUrl, '_blank')
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  const handleIframeError = () => {
    console.log('Iframe failed to load - likely blocked by X-Frame-Options')
    setIframeError(true)
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] bg-slate-950"
    >
      {/* Browser Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm"
      >
        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
            title="Back to Portfolio"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <button
            onClick={handleRefresh}
            className="w-8 h-8 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
            title="Refresh"
          >
            <motion.svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              className="text-slate-400"
              animate={isLoading ? { rotate: 360 } : {}}
              transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </motion.svg>
          </button>

          <button
            onClick={handleOpenInNewTab}
            className="w-8 h-8 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors cursor-pointer"
            title="Open in New Tab"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" x2="21" y1="14" y2="3"/>
            </svg>
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 mx-6">
          <div className="glass rounded-lg px-4 py-2 flex items-center gap-3">
            <div className="w-4 h-4 flex items-center justify-center">
              {isLoading ? (
                <motion.div
                  className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (iframeError || shouldOpenInNewTab) ? (
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              )}
            </div>
            <span className="text-slate-300 text-sm orbitron flex-1 truncate">
              {getDomain(currentUrl)}
            </span>
            <div className="text-slate-500 text-xs">🔒</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-lg glass hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Browser"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </motion.div>

      {/* Browser Content */}
      <div className="flex-1 relative h-[calc(100vh-120px)]">
        <AnimatePresence>
          {isLoading && !shouldOpenInNewTab && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10"
            >
              <div className="text-center">
                <motion.div
                  className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <div className="text-slate-400 text-sm orbitron">loading {getDomain(currentUrl)}...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(iframeError || shouldOpenInNewTab) ? (
          <div className="flex items-center justify-center h-full bg-slate-900">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-xl text-slate-300 orbitron mb-2">
                {shouldOpenInNewTab ? 'External Site' : 'Site Blocked Embedding'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {shouldOpenInNewTab 
                  ? `${getDomain(currentUrl)} is best viewed in a new tab for full functionality.`
                  : `${getDomain(currentUrl)} doesn't allow embedding in frames for security reasons.`
                }
              </p>
              <button
                onClick={handleOpenInNewTab}
                className="glass px-6 py-3 rounded-lg text-violet-400 hover:bg-violet-500/10 transition-colors cursor-pointer orbitron"
              >
                Open in New Tab
              </button>
            </div>
          </div>
        ) : (
          <motion.iframe
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            src={currentUrl}
            className="w-full h-full border-none"
            title="Web Browser"
            onLoad={() => {
              console.log('Iframe loaded successfully')
              setIsLoading(false)
            }}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
          />
        )}
      </div>

      {/* Browser Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex items-center justify-between p-3 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm h-[60px]"
      >
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>nytrixis browser</span>
          <span>•</span>
          <span>
            {shouldOpenInNewTab ? 'external site detected' : 
             iframeError ? 'blocked by site' : 'secure connection'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>powered by nytrixis.dos</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
