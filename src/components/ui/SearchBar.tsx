'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  onNavigate?: (url: string) => void
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Don't collapse if clicking on suggestions
    const relatedTarget = e.relatedTarget as HTMLElement
    if (relatedTarget?.closest('.suggestions-dropdown')) {
      return
    }
    if (!searchValue) {
      setIsExpanded(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim() || isNavigating) return

    let url = searchValue.trim()
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    // Validate URL
    try {
      new URL(url)
      setIsNavigating(true)
      console.log('Navigating to:', url) // Debug log
      
      // Trigger navigation through parent component
      if (onNavigate) {
        await onNavigate(url)
      }
      
      // Reset after navigation
      setTimeout(() => {
        setIsNavigating(false)
        setSearchValue('')
        setIsExpanded(false)
      }, 1500)
    } catch (error) {
      console.error('Invalid URL:', error)
      setIsNavigating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchValue('')
      setIsExpanded(false)
      inputRef.current?.blur()
    }
  }

  const handleQuickAccess = async (url: string) => {
    console.log('Quick access clicked:', url) // Debug log
    setSearchValue(url)
    setIsNavigating(true)
    
    // Don't add https:// if it already exists
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
    console.log('Full URL:', fullUrl) // Debug log
    
    if (onNavigate) {
      await onNavigate(fullUrl)
    }
    
    setTimeout(() => {
      setIsNavigating(false)
      setSearchValue('')
      setIsExpanded(false)
    }, 1500)
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50" style={{ marginBottom: '10px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <form onSubmit={handleSubmit}>
          <motion.div
            className="relative flex items-center"
            animate={{
              width: isExpanded ? '400px' : '280px',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >

            {/* Input field with left padding for icon */}
            <motion.input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={isExpanded ? 'enter url or search...' : 'search "www.mykiva.in"'}
              className="w-full h-12 pl-10 pr-6 z-1 glass terminal-glow rounded-full text-slate-300 placeholder-slate-500 text-sm outline-none border border-slate-700/30 hover:border-slate-600/50 focus:border-violet-500/50 transition-all duration-300"
              style={{ cursor: 'text' }}
            />
          </motion.div>

          {/* Suggestion dropdown when focused */}
          <AnimatePresence>
            {isExpanded && !searchValue && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="suggestions-dropdown absolute bottom-full mb-2 w-full glass rounded-xl p-4 border border-slate-700/30"
              >
                <div className="text-slate-400 text-xs mb-3 orbitron">quick access</div>
                <div className="space-y-2">
                  {[
                    { name: 'mykiva.in', url: 'www.mykiva.in', desc: 'e-commerce platform' },
                    { name: 'github', url: 'github.com/nytrixis', desc: 'code repositories' },
                    { name: 'linkedin', url: 'linkedin.com/in/nytrixis', desc: 'professional profile' }
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur
                      onClick={() => handleQuickAccess(item.url)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-slate-300 text-sm">{item.url}</div>
                        <div className="text-slate-500 text-xs">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  )
}
